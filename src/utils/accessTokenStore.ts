import redis from "redis";
import bluebird from "bluebird";
import jwt from "jsonwebtoken";
import uuidv4 from "uuid/v4";

import { UserModel } from "../models/User";
import logger from "../utils/logger";

export interface AccessTokenPayload {
  _id: string;
  username: string;
  jti: string;
}

export interface AccessTokenValidation {
  isValid: boolean;
  data?: AccessTokenPayload;
}

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN_SECONDS = parseInt(process.env.JWT_EXPIRES_IN_SECONDS);

bluebird.promisifyAll(redis);
const redisClient = redis.createClient();
redisClient.on("error", err => {
  logger.error(err);
  process.exit();
});

const buildRedisKeyForToken = (userId: string, tokenId: string): string => `user:${userId}:${tokenId}`;

const createTokenAsync = (user: UserModel): Promise<string> => {
  const payload = {
    _id: user._id,
    username: user.username
  };
  const options = {
    expiresIn: EXPIRES_IN_SECONDS,
    jwtid: uuidv4()
  };
  return new Promise<string>((resolve, reject) => {
    const redisKey = buildRedisKeyForToken(payload._id, options.jwtid);
    redisClient.set(redisKey, "1", "EX", EXPIRES_IN_SECONDS, err => {
      if (err) {
        return reject(err);
      }
      jwt.sign(payload, SECRET, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      });
    });
  });
};

const validateTokenAsync = (token: string): Promise<AccessTokenValidation> => {
  return new Promise<AccessTokenValidation>(resolve => {
    jwt.verify(token, SECRET, { ignoreExpiration: true }, (err, decodedData: AccessTokenPayload) => {
      if (err) {
        return resolve({ isValid: false });
      }
      const redisKey = buildRedisKeyForToken(decodedData._id, decodedData.jti);
      redisClient.exists(redisKey, (err, numberOfKeys) => {
        if (err || !numberOfKeys) {
          return resolve({ isValid: false });
        }
        return resolve({ isValid: true, data: decodedData });
      });
    });
  });
};

const invalidateTokenAsync = (token: string): Promise<void> => {
  return new Promise<void>(resolve => {
    jwt.verify(token, SECRET, { ignoreExpiration: true }, (err, decodedData: AccessTokenPayload) => {
      if (err) {
        return resolve();
      }
      const redisKey = buildRedisKeyForToken(decodedData._id, decodedData.jti);
      redisClient.del(redisKey, () => {
        return resolve();
      });
    });
  });
};

export default {
  createTokenAsync,
  validateTokenAsync,
  invalidateTokenAsync
};
