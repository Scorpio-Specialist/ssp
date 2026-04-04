const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  price: { type: Number, required: true },

  size: { type: Number, required: true },

  color: { type: String },

  description: { type: String },

  images: [String], 
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

}, { timestamps: true });


module.exports = mongoose.model("Product", productSchema);