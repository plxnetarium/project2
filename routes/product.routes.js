const express = require("express");
const router = express.Router();
const Category = require("../models/Category.js");
const Product = require("../models/Product.js");
const isAdmin = require("../middleware/is-admin.js");
const mongoose = require("mongoose");

router.param("id", (req, res, next, id) => {
    if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(404).send("Product not found.");
    }
    next();
});

router.get("/", async (req, res, next) => {
    try {
        const products = await Product.find().populate("categoryName").sort({ createdAt: -1 });
        res.render("product-list.ejs", { products });
    } catch (error) {
        next(error);
    }
});

router.get("/new", isAdmin, async (req, res) => {
    const categories = await Category.find();

    res.render("products.ejs", { categories });
});

router.post("/", isAdmin, async (req, res) => {
    try {
        await Product.create({
            productName: req.body.productName,
            categoryName: req.body.categoryName,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            imageUrl: req.body.imageUrl
        });

        res.redirect("/product/new");
    } catch (error) {
        console.error(error);
        res.status(400).send("Could not create product. Check your fields.");
    }
});

router.get("/:id/edit", isAdmin, async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found.");
        const categories = await Category.find();
        res.render("product-edit.ejs", { product, categories, error: null });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("categoryName");
        if (!product) return res.status(404).send("Product not found.");
        res.render("product-details.ejs", { product });
    } catch (error) {
        next(error);
    }
});

router.put("/:id", isAdmin, async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found.");

        product.set({
            productName: req.body.productName,
            categoryName: req.body.categoryName,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            imageUrl: req.body.imageUrl
        });

        try {
            await product.save();
        } catch (error) {
            if (error.name !== "ValidationError") throw error;
            const categories = await Category.find();
            return res.status(400).render("product-edit.ejs", {
                product, categories, error: "Could not update product. Check your fields."
            });
        }

        res.redirect(`/product/${product._id}`);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", isAdmin, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send("Product not found.");
        res.redirect("/product");
    } catch (error) {
        next(error);
    }
});

module.exports = router;
