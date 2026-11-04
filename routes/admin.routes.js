const router = require("express").Router();
const isAdmin = require("../middleware/is-admin.js");

router.get("/", isAdmin, (req, res) => {
  res.render("admin.ejs");
});

module.exports = router;
