import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cartItems: [
      {
        name: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],
    shippingAddress: {
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    totalPrice: Number,
    status: {
      type: String,
      enum: ["Preparing", "Shipped", "Out for Delivery", "Delivered"],
      default: "Preparing",
    },
    history: [
      {
        status: String, // "Preparing", "Shipped", etc.
        time: { type: Date, default: Date.now },
      },
    ],
    orderDate: { type: Date, default: Date.now },
    expectedDelivery: { type: Date },

  },
  { timestamps: true }
);

// middleware to auto-push status change into history
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.history.push({ status: this.status });
  }
  next();
});

export default mongoose.model("Order", orderSchema);
