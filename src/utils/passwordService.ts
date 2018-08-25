import bcrypt from "bcrypt-nodejs";

const ROUNDS = 10;

const hashPasswordAsync = async (rawPassword: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(ROUNDS, (err, salt) => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(rawPassword, salt, undefined, (err, hashedPassword) => {
        if (err) {
          return reject(err);
        }
        return resolve(hashedPassword);
      });
    });
  });
};

const comparePasswordAsync = async (rawPassword: string, hashedPassword: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(rawPassword, hashedPassword, (err: Error, isMatch: boolean) => {
      if (err) {
        return reject(err);
      }
      return resolve(isMatch);
    });
  });
};

export default {
  hashPasswordAsync,
  comparePasswordAsync
};
