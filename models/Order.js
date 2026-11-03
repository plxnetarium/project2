const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    trim: true,
    default: 'Pending'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  deliveryAddress: {
    type: String,
    required: true,
    trim: true
  },
  Total: {
    type: Number,
    required: true,
    min: 0
  },
  item: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
  },

}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
