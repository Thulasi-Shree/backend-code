const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
    default: 1
  }   
});
  
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number

});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
