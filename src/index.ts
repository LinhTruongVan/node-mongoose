import mongoose from "mongoose";
import bluebird from "bluebird";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import logger from "./utils/logger";
import app from "./app";
import dataSeeder from "./dataSeeder";

const onFullfiled = async () => {
  try {
    await dataSeeder.seedAdminAsync();
  } catch {
    process.exit();
  }
  app.listen(app.get("port"), () => {
    console.log(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
  });
};

const onRejected = (err: any) => {
  const errMessage = "MongoDB connection error. Please make sure MongoDB is running.";
  logger.error(errMessage, err);
  console.log(errMessage);
  process.exit();
};

(<any>mongoose).Promise = bluebird;
mongoose
  .connect(process.env.MONGO_URI)
  .then(onFullfiled)
  .catch(onRejected);
