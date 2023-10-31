const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

//create order
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('no cart items provided');
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      'please provide tax and shipping fee'
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `no product with id: ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    //add item to order
    orderItems = [...orderItems, singleOrderItem];
    //calculate subtotal
    subtotal += price * item.amount;
  }
  //calculate total
  const total = tax + shippingFee + subtotal;
  //get client secret from fake stripe
  const paymentIntent = await fakeStripeAPI({ amount: total, curency: 'usd' });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

//get all orders
const getAllOrders = async (req, res) => {
  res.send('getAllOrders');
};

//get single order
const getSingleOrder = async (req, res) => {
  res.send('getSingleOrder');
};

//get current user orders
const getCurrentUserOrders = async (req, res) => {
  res.send('getCurrentUserOrders');
};

//update order
const updateOrder = async (req, res) => {
  res.send('updateOrder');
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
