// models/AdminProduct.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    expectedDelivery: {
      type: Date, // ✅ new field
      required: false, // admin can set it
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
