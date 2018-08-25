import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, lowercase: true, trim: true },
    password: String
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const User = mongoose.model("User", userSchema);
export default User;
