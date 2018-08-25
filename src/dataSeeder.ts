import logger from "./utils/logger";
import passwordService from "./utils/passwordService";
import User from "./models/User";

const seedAdminAsync = async () => {
  try {
    const admin = await User.findOne({ username: process.env.ADMIN_USERNAME }).exec();
    if (admin) return;

    const newAdmin = new User({
      username: process.env.ADMIN_USERNAME,
      password: await passwordService.hashPasswordAsync(process.env.ADMIN_PASSWORD)
    });
    await newAdmin.save();
    logger.info("Seeding users: Successful!");
  } catch (err) {
    logger.error("Seeding users: Error!", err);
  }
};

export default {
  seedAdminAsync
};
