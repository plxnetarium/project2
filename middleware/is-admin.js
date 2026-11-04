const isAdmin = (req, res, next) => {
  if (!req.session.user) return res.redirect("/auth/sign-in");
  if (req.session.user.role !== "admin") {
    return res.status(403).send("Only administrators can access this page.");
  }
  next();
};

module.exports = isAdmin;
