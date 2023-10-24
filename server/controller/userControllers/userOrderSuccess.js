const Users = require("../../model/users");
const Orders = require("../../model/orders");
const products=require("../../model/products")

exports.userOrderSuccessGet = async (req, res,item) => {
  try {
    const orderId = req.params.id;
    const productId = item.product;
    console.log(`order id from order success`,orderId)
    const response = await Orders.findOne({ orderId: orderId })
    const product=await products.findOne({productId})
    const address = await Users.findOne({ "address._id": response.address },
      { "address.$": 1 });
    console.log(1111, address.address[0]);
    res.render("order_success", { loggedIn: true, orders: true, address: address.address[0], details: response,order:true,product });
  } catch (err) {
    console.log(err);
  }
};


