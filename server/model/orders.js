const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  product: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      name: {
        type: String,
      },

      category: {
        type: String,
      },

      price: {
        type: Number,
      },

      quantity: {
        type: Number,
      },

      image: {
        type: String,
      },
    },
  ],

  address: {
    type: String,
    required: true,
  },

  total: {
    type: Number,
    require: true,
  },

  orderId: {
    type: String,
    required: true,
  },

  paymentMethod: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Returned"],
    default: "Pending",
  },

  date: {
    type: Date,
    default: Date.now,
  },

  expectedDate: {
    type: Date,
  },

  deliveredDate: {
    type: Date,
  },

  returnEndDate: {
    type: Date,
  },

  discountAmount: {
    type: Number,
    default: 0,
  },
  amountAfterDiscount: {
    type: Number,
  },
  couponName: {
    type: String,
    default: "NIL",
  },
});

const order = mongoose.model("Order", orderSchema);
module.exports = order;
