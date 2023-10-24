const Orders = require("../../model/orders");
const Users = require("../../model/users");

exports.adminOrderViewGet = async (req, res) => {
  try {
    const orders = await Orders.find().sort({date: -1});
    const users = await Users.find();
    res.render("admin_orders_view", { orders, users });
  } catch (err) {
    console.log(err);
  }
};

exports.adminOrderStatusPost = async (req, res) => {
    try{
        const newStatus = req.body.newStatus;
        const orderId = req.body.orderId;
        const order = await Orders.findOne({_id: orderId});
        if(newStatus == "Delivered"){
          const deliveredDate = new Date();
          const returnDate = new Date(deliveredDate);
          returnDate.setDate(returnDate.getDate() + 7);

          order.deliveredDate = deliveredDate;
          order.returnEndDate = returnDate;
          
        }
        order.status = newStatus;
        await order.save();
        
    }catch(err) {
      console.log("this only")
        console.log(err);
    }
}

exports.adminOrderHistoryGet = async (req, res) => {
  try {
    console.log(`entered admin order history`);
      // const orderId = req.params.orderId;
      const user = await Users.findOne({ email: req.session.email });
        
            if (req.session.email && !user.isBlocked) {
              console.log(7777)
              const userId = user._id;
              const order = await Orders.find({ userId: userId }).sort({ date: -1 });
              const userAddresses = user.address;

      res.render("admin_order_history", {
          loggedIn: true,
          user,
          userAddresses,
          order,
      });
    }
  } catch (err) {
      console.log(err);
  }
};
exports.adminOrderDetailsGet = async (req, res) => {
  try {
    console.log(97643433434)
    const orderId = req.query.orderId;
    const order = await Orders.findById(orderId);
      const user = await Users.findOne({ email: req.session.email });
      const userAddress = user.address.find(
        (address) => address.id === order.address
      );
      if (order) {
        res.render("admin_order_details", {
          loggedIn: true,
          orders: order,
          address: userAddress,
          
        });
      }
    
  } catch (err) {
    console.log(err);
  }
};
