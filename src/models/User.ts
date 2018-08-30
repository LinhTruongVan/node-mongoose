import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  username: string;
  password: String;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, lowercase: true, trim: true },
    password: String
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const User = mongoose.model("User", userSchema);
export default User;
