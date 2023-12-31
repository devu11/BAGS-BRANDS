const Category = require("../model/category");
const User = require("../model/users");

const userHeaderMiddleware = async (req, res, next) => {
  try {
    const categories = await Category.find({isAvailable: true});
    const user = await User.findOne({ email: req.session.email });
    if (user) {
      const userCartItems = user.cart.length;
      const isBlocked = user.isBlocked;
      const userWallet = user.wallet.balance;
      res.locals.cartItemsCount = userCartItems;
      res.locals.isBlocked = isBlocked;
      res.locals.userWallet = userWallet;
    } 
    res.locals.categories = categories;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
};


module.exports = userHeaderMiddleware;
