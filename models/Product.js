const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String
  },
  categoryName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: {
    type: Number,
    maxlength: 350
  },
  price: {
    type: Number
  },
  stock: {
    type: Number
  },
//imageURL

}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
