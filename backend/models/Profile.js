// models/Profile.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
}, { timestamps: true });

const Profile = mongoose.model("Profile", userSchema);
export default Profile;