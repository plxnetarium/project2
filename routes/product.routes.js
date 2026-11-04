const express = require("express");
const router = express.Router();
const Category = require("../models/Category.js");
const Product = require("../models/Product.js");
const isAdmin = require("../middleware/is-admin.js");

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

module.exports = router;
