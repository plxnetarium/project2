const router = require("express").Router();
const isAdmin = require("../middleware/is-admin.js");
const Product = require("../models/Product.js");
const Category = require("../models/Category.js");

router.get("/", isAdmin, async (req, res, next) => {
  try {
    const [products, categoryCount] = await Promise.all([
      Product.find().populate("categoryName", "categoryName").sort({ productName: 1 }),
      Category.countDocuments()
    ]);
    const outOfStockCount = products.filter((product) => product.stock <= 0).length;
    res.render("admin.ejs", { products, categoryCount, outOfStockCount });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
