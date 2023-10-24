const Category = require("../../model/category");
const Product = require("../../model/products");
const User = require("../../model/users");
const Banners = require("../../model/banner");

exports.home = async (req, res) => {
  
  try {
    console.log("22222222222222222222");
    const category = await Category.find({ isAvailable: true });
    const products = await Product.aggregate([{ $sample: { size: 5 } }]);
    const user = await User.findOne({ email: req.session.email });
    const banners = await Banners.find({active:true});
    console.log(`baner11111111111111`,banners);
    res.render("home", {
      loggedIn: true,
      categories: category,
      products,
      banners,
      user
    });
  } catch (err) {
    if (err.response.status == 300) {
      window.location.href = "/login";
    }
    console.log(err);
  }
};



