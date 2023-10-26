const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Product = require('../models/Product');

//create product
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

//get all products
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ count: products.length, products });
};

//get single product
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  //??????
  if (!product) {
    throw new CustomError.NotFoundError(`no product with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

//update product
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  //??????
  if (!product) {
    throw new CustomError.NotFoundError(`no product with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

//delete product
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  //??????
  if (!product) {
    throw new CustomError.NotFoundError(`no product with id: ${productId}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'product removed' });
};

//upload image
const uploadImage = async (req, res) => {
  res.send('uploadImage');
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
