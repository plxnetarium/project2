const router = require("express").Router();
const mongoose = require("mongoose");
const Product = require("../models/Product.js");

router.post("/", async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const quantity = req.body.quantity === undefined ? 1 : Number(req.body.quantity);

    if (!mongoose.isObjectIdOrHexString(productId)) {
      return res.status(400).send("Invalid product.");
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return res.status(400).send("Enter a valid quantity.");
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found.");

    const id = String(product._id);
    const cart = req.session.cart || [];
    const existingItem = cart.find((item) => item.productId === id);
    const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

    if (newQuantity > product.stock) {
      return res.status(400).send("Not enough stock available.");
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.push({ productId: id, quantity });
    }
    req.session.cart = cart;
    req.session.save((error) => {
      if (error) return next(error);
      res.redirect("/cart");
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const cart = req.session.cart || [];
    const items = [];

    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        const unitPriceFils = Math.round(product.price * 1000);
        items.push({ product, quantity: item.quantity, subtotalFils: unitPriceFils * item.quantity });
      }
    }

    const totalFils = items.reduce((sum, item) => sum + item.subtotalFils, 0);
    res.render("cart.ejs", { items, totalFils });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
