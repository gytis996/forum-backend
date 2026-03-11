import mongoose from "../db.js";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export default mongoose.model("User", UserSchema);
