const express = require('express');
const router = express.Router();
const Product = require("../Models/PorductModel");
const { authMiddleware, isAdmin } = require("../Middleware/Auth");

// View all products
router.get("/view", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      message: "All products retrieved successfully",
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: err.message
    });
  }
});

// Create new product
router.post("/create", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, description, size, color, images, price } = req.body;

    if (!name || !price)
      return res.status(400).json({ success: false, message: "Name and price are required" });

    const newProduct = await Product.create({ name, description, size, color, images, price });

    res.status(201).json({ success: true, message: "Product created successfully", data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating product", error: err.message });
  }
});

// Update product
router.put("/update/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating product", error: err.message });
  }
});

// Delete product
router.delete("/delete/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted successfully", data: deletedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting product", error: err.message });
  }
});

module.exports = router;