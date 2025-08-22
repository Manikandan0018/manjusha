import mongoose from "mongoose";

const myCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  price: String,
  description: String,
  image: String,
  shippingAddress: {
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  quantity: { type: Number, default: 1 },
  orderDate: { type: Date, default: Date.now },
  expectedDelivery: { type: Date },
}, { timestamps: true });


export default mongoose.model("MyCart", myCartSchema);
