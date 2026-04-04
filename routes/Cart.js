const express = require("express");
const router = express.Router();
const Cart = require("../Models/CartModel"); // your Cart model
const Product = require("../Models/PorductModel"); // your Product model
const { authMiddleware } = require("../Middleware/Auth");

// -------------------- Add a product to cart --------------------
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Get user's cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: req.user.id,
        products: [{ product: productId, quantity, size, color }],
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity, size, color });
      }
    }

    // Populate products to calculate totalPrice
    await cart.populate("products.product");

    // Remove any products that no longer exist
    cart.products = cart.products.filter((item) => item.product);

    // Calculate total price
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------- Get user's cart --------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0)
      return res.status(404).json({ message: "Cart is empty" });

    // Remove any products that no longer exist
    cart.products = cart.products.filter((item) => item.product);

    // Recalculate total price
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------- Delete a product from cart --------------------
router.delete("/delete/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.populate("products.product");

    // Remove any null products
    cart.products = cart.products.filter((item) => item.product);

    // Recalculate total price
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Product removed", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------- Place order (clear cart) --------------------
router.post("/place-order", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Here you can create an Order model to save order details

    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;