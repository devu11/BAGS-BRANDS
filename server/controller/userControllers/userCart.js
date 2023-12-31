const User = require("../../model/users");
const Product = require("../../model/products");

exports.userCartGet = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email }).populate({
      path: "cart.product",
      model: "Product",
    });
    const cartItems = user.cart;
    let subTotal = 0;
    let errorMessage = [];
    for (const cartItem of cartItems) {
      let cartItemPrice = 0;
      if (cartItem.product.offerPrice > 0) {
        cartItemPrice = cartItem.product.offerPrice;
      } else {
        cartItemPrice = cartItem.product.price;
      }
      const itemPrice = cartItemPrice * cartItem.quantity;
      subTotal += itemPrice;

      if (cartItem.quantity > cartItem.product.stock) {
        errorMessage.push(`Out of Stock`);
      } else {
        errorMessage.push("");
      }
    }
    res.render("user_cart", {
      loggedIn: true,
      cart: user.cart,
      subTotal,
      errorMessage,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.userCartPost = async (req, res) => {
  const productId = req.params.productid;
  const quantity = parseInt(req.params.quantity);
  const product = await Product.findById(productId);
  if (product.stock == 0) {
    return res.status(400).end();
  }
  try {
    const user = await User.findOne({ email: req.session.email });
    if (!user) {
      return res.render("login", { loggedIn: false });
    }

    if (quantity > product.stock) {
      return res.status(400).end();
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId.toString()
    );
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity: quantity });
    }
    await user.save();
    return res.status(200).end();
  } catch (err) {
    console.log(err);
  }
};

exports.userCartQuantityUpdate = async (req, res) => {
  const { productId, newQuantity } = req.body;
  const user = await User.findOne({ email: req.session.email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const cartItem = user.cart.find((item) => item.product.toString() === productId);

  if (!cartItem) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  const product = await Product.findById(cartItem.product);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  let productActualAmount = product.offerPrice > 0 ? product.offerPrice : product.price;

  if (newQuantity <= 0 || newQuantity > product.stock) {
    return res.status(400).json({ error: " out of stock. Please decrease quantity", productId: product._id });
  }

  try {
    cartItem.quantity = newQuantity;

    const fullCartTotal = user.cart.reduce((acc, item) => {
      const productPrice = item.product.offerPrice > 0 ? item.product.offerPrice : item.product.price;
      return acc + productPrice * item.quantity;
    }, 0);

    await user.save();
    res.status(200).json({
      updatedQuantity: cartItem.quantity,
      total: cartItem.quantity * productActualAmount,
      fullCartTotal,
      productId: product._id,
    });
  } catch (err) {
    console.log(err);
    // Handle errors as needed
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.userCartRemovePost = async (req, res) => {
    const productId = req.params.id;
    try {
      const user = await User.findOne({ email: req.session.email });
      if(user && user.isBlocked){
        return res.status(301).end();
      }
      if (user) {
        const index = user.cart.findIndex(
          (item) => item.product.toString() === productId
        );
        if (index > -1) {
          user.cart.splice(index, 1);
          await user.save();
          return res.status(200).end();
        }
      }
    } catch (err) {
      console.log(err);
    }
};
