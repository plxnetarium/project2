const router = require("express").Router();
const Category = require("../models/Category.js");
const isAdmin = require("../middleware/is-admin.js");

router.use(isAdmin);

router.get("/new", (req, res) => {
  res.render("categories.ejs", { error: null, categoryName: "" });
});

router.post("/", async (req, res, next) => {
  const categoryName = typeof req.body.categoryName === "string"
    ? req.body.categoryName.trim()
    : "";

  if (!categoryName) {
    return res.status(400).render("categories.ejs", {
      error: "Enter a category name.", categoryName
    });
  }

  try {
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).render("categories.ejs", {
        error: "This category already exists.", categoryName
      });
    }

    await Category.create({ categoryName });
    res.redirect("/product/new");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
