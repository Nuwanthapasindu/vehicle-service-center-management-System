const Review = require("../model/Review");
const Booking = require("../model/Booking");
const JobCard = require("../model/JobCard");
const User = require("../model/User");
const AppError = require("../error/AppError");
const mongoose = require("mongoose");
const { validateReviewAdd, validateReviewUpdate } = require("../validation/review.validation");

module.exports.addReview = async (payload, mobile) => {
  try {
    const { error } = validateReviewAdd(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const booking = await Booking.findOne({ _id: payload.bookingId, customer: customer._id, isDeleted: false });
    if (!booking) throw new AppError("Booking not found", 404);

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: payload.bookingId, isDeleted: false });
    if (existingReview) throw new AppError("Review already submitted for this booking", 400);

    const newReview = new Review({
      customer: customer._id,
      booking: payload.bookingId,
      rating: payload.rating,
      comment: payload.comment || "",
    });

    await newReview.save();
    return "Review submitted successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to submit review", error.statusCode || 500);
  }
};

module.exports.getBookingDetailsForReview = async (bookingId, mobile) => {
  try {
    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const booking = await Booking.findOne({ _id: bookingId, customer: customer._id, isDeleted: false })
      .populate({
        path: "vehicle",
        select: "make model licensePlate image",
        populate: { path: "image" }
      });

    if (!booking) throw new AppError("Booking not found", 404);

    const jobCard = await JobCard.findOne({ booking: bookingId, isDeleted: false })
      .populate("selectedPackage", "name");

    if (!jobCard) throw new AppError("Service details not found", 404);

    return {
      bookingId: booking._id,
      serviceDate: booking.date,
      packageName: jobCard.selectedPackage ? jobCard.selectedPackage.name : "N/A",
      status: jobCard.status,
      vehicleImage: (booking.vehicle && booking.vehicle.image) ? booking.vehicle.image.url : null,
      vehicleName: booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : "N/A"
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch booking details for review", error.statusCode || 500);
  }
};

module.exports.getMyReviews = async (mobile, filterType = 'all') => {
  try {
    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    let query = { customer: customer._id, isDeleted: false };
    if (filterType === 'published') query.isApproved = true;
    else if (filterType === 'pending') query.isApproved = false;

    const reviews = await Review.find(query)
      .populate({
        path: 'booking',
        populate: {
          path: 'vehicle',
          select: 'make model licensePlate'
        }
      })
      .sort({ createdAt: -1 });

    const enrichedReviews = await Promise.all(reviews.map(async (review) => {
      const jobCard = await JobCard.findOne({ booking: review.booking?._id, isDeleted: false })
        .populate("selectedPackage", "name");

      const reviewObj = review.toObject();
      return {
        ...reviewObj,
        packageDetails: jobCard ? (jobCard.selectedPackage ? jobCard.selectedPackage.name : "N/A") : "N/A",
        serviceDate: review.booking?.date || review.createdAt
      };
    }));

    return enrichedReviews;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch reviews", error.statusCode || 500);
  }
};

module.exports.getReviewById = async (reviewId, mobile) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const review = await Review.findOne({ _id: reviewId, customer: customer._id, isDeleted: false });
    if (!review) throw new AppError("Review not found", 404);

    return review;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch review", error.statusCode || 500);
  }
};

module.exports.updateReview = async (reviewId, mobile, payload) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const { error } = validateReviewUpdate(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const review = await Review.findOne({ _id: reviewId, customer: customer._id, isDeleted: false });
    if (!review) throw new AppError("Review not found", 404);

    if (review.isApproved) {
      throw new AppError("Approved reviews cannot be updated", 403);
    }

    if (payload.rating) review.rating = payload.rating;
    if (payload.comment !== undefined) review.comment = payload.comment;

    review.isApproved = false;

    await review.save();
    return "Review updated successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to update review", error.statusCode || 500);
  }
};

module.exports.deleteReview = async (reviewId, mobile) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const review = await Review.findOne({ _id: reviewId, customer: customer._id, isDeleted: false });
    if (!review) throw new AppError("Review not found", 404);

    if (review.isApproved) {
      throw new AppError("Approved reviews cannot be deleted", 403);
    }

    review.isDeleted = true;
    review.deletedAt = new Date();

    await review.save();
    return "Review deleted successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to delete review", error.statusCode || 500);
  }
};
