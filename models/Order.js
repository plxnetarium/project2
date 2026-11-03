const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String
  },
  phone: {
    type: Number
  },
  deliveryAddress: {
    type: String
  },
  Total: {
    type: Number
  },
  item: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
