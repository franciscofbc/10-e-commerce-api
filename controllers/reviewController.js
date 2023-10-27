const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { checkPermissions } = require('../utils');

//create review
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const { userId } = req.user;

  //??? another message appear
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`no product with id: ${productId}`);
  }

  //already verified in model
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'already submitted reviews for this product'
    );
  }

  req.body.user = userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

//get all reviews
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

//get single review
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  //???
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

//update review
const updateReview = async (req, res) => {
  res.send('updateReview');
};

//delete review
const deleteReview = async (req, res) => {
  res.send('deleteReview');
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
