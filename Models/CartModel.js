const mongoose = require("mongoose");
const Product = require("./PorductModel");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      size: Number,
      color: String,
    },
  ],
  totalPrice: { type: Number, default: 0 },
});

// Pre-save hook to calculate totalPrice
cartSchema.pre("save", async function () {
  if (!this.products || this.products.length === 0) {
    this.totalPrice = 0;
    return;
  }

  // Populate products
  await this.populate("products.product");

  let total = 0;
  for (const item of this.products) {
    total += item.product.price * item.quantity;
  }

  this.totalPrice = total;
});

module.exports = mongoose.model("Cart", cartSchema);