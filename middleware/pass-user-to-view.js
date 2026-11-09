const User = require("../models/User.js");

const passUserToView = async (req, res, next) => {
  const signedInUser = req.session.user;
  if (signedInUser) {
    const account = await User.findById(signedInUser._id).select("sessionVersion");
    if (!account || (account.sessionVersion ?? 0) !== (signedInUser.sessionVersion ?? 0)) {
      delete req.session.user;
      delete req.session.cart;
    }
  }
  res.locals.user = req.session.user;
  next();
};

module.exports = passUserToView;
