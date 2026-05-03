const Review = require("../model/Review");
const Booking = require("../model/Booking");
const JobCard = require("../model/JobCard");
const User = require("../model/User");
const AppError = require("../error/AppError");
const mongoose = require("mongoose");
const {
  validatedReviewAdd,
  validatedReviewUpdate,
  validatedAdminReply,
  validatedReviewApproval,
} = require("../validation/review.validation");

module.exports.addReview = async (payload, mobile) => {
  try {
    const { error } = validatedReviewAdd(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const booking = await Booking.findOne({
      _id: payload.bookingId,
      customer: customer._id,
      isDeleted: false,
    });
    if (!booking) throw new AppError("Booking not found", 404);

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({
      booking: payload.bookingId,
      isDeleted: false,
    });
    if (existingReview)
      throw new AppError("Review already submitted for this booking", 400);

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
    throw new AppError(
      error.message || "Failed to submit review",
      error.statusCode || 500,
    );
  }
};

module.exports.getBookingDetailsForReview = async (bookingId, mobile) => {
  try {
    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const booking = await Booking.findOne({
      _id: bookingId,
      customer: customer._id,
      isDeleted: false,
    }).populate({
      path: "vehicle",
      select: "make model licensePlate image",
      populate: { path: "image" },
    });

    if (!booking) throw new AppError("Booking not found", 404);

    const jobCard = await JobCard.findOne({
      booking: bookingId,
      isDeleted: false,
    }).populate("selectedPackage", "name");

    if (!jobCard) throw new AppError("Service details not found", 404);

    return {
      bookingId: booking._id,
      serviceDate: booking.date,
      packageName: jobCard.selectedPackage
        ? jobCard.selectedPackage.name
        : "N/A",
      status: jobCard.status,
      vehicleImage:
        booking.vehicle && booking.vehicle.image
          ? booking.vehicle.image.filePath ||
            booking.vehicle.image.url ||
            booking.vehicle.image
          : null,
      vehicleName: booking.vehicle
        ? `${booking.vehicle.make} ${booking.vehicle.model}`
        : "N/A",
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to fetch booking details for review",
      error.statusCode || 500,
    );
  }
};

module.exports.getMyReviews = async (mobile, filterType = "all") => {
  try {
    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    let query = { customer: customer._id, isDeleted: false };
    if (filterType === "published") query.isApproved = true;
    else if (filterType === "pending") query.isApproved = false;

    const reviews = await Review.find(query)
      .populate({
        path: "booking",
        populate: {
          path: "vehicle",
          select: "make model licensePlate",
        },
      })
      .sort({ createdAt: -1 });

    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const jobCard = await JobCard.findOne({
          booking: review.booking?._id,
          isDeleted: false,
        }).populate("selectedPackage", "name");

        const reviewObj = review.toObject();
        return {
          ...reviewObj,
          packageDetails: jobCard
            ? jobCard.selectedPackage
              ? jobCard.selectedPackage.name
              : "N/A"
            : "N/A",
          serviceDate: review.booking?.date || review.createdAt,
        };
      }),
    );

    return enrichedReviews;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to fetch reviews",
      error.statusCode || 500,
    );
  }
};

module.exports.getReviewById = async (reviewId, mobile) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const review = await Review.findOne({
      _id: reviewId,
      customer: customer._id,
      isDeleted: false,
    });
    if (!review) throw new AppError("Review not found", 404);

    return review;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to fetch review",
      error.statusCode || 500,
    );
  }
};

module.exports.updateReview = async (reviewId, mobile, payload) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const { error } = validatedReviewUpdate(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const review = await Review.findOne({
      _id: reviewId,
      customer: customer._id,
      isDeleted: false,
    });
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
    throw new AppError(
      error.message || "Failed to update review",
      error.statusCode || 500,
    );
  }
};

module.exports.deleteReview = async (reviewId, mobile) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const customer = await User.findOne({ mobile, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const review = await Review.findOne({
      _id: reviewId,
      customer: customer._id,
      isDeleted: false,
    });
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
    throw new AppError(
      error.message || "Failed to delete review",
      error.statusCode || 500,
    );
  }
};

module.exports.getAllPublicReviews = async (query) => {
  try {
    const { service, sort = "recent", page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // 1. Calculate Stats (Overall)
    const statsResult = await Review.aggregate([
      { $match: { isApproved: true, isDeleted: false } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]);

    const stats =
      statsResult.length > 0
        ? statsResult[0]
        : {
            averageRating: 0,
            totalReviews: 0,
            star5: 0,
            star4: 0,
            star3: 0,
            star2: 0,
            star1: 0,
          };

    // 2. Build Query for List
    let matchQuery = { isApproved: true, isDeleted: false };

    // If filtering by service name (we'll need to join for this if it's on JobCard)
    // For now, let's keep it simple and filter approved reviews

    let sortQuery = { createdAt: -1 };
    if (sort === "top-rated") sortQuery = { rating: -1, createdAt: -1 };

    const reviews = await Review.find(matchQuery)
      .populate("customer", "name")
      .populate({
        path: "booking",
        populate: { path: "vehicle", select: "make model" },
      })
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const jobCard = await JobCard.findOne({
          booking: review.booking?._id,
          isDeleted: false,
        }).populate({
          path: "selectedPackage",
          populate: { path: "servicesIncluded", select: "name" },
        });

        const packageObj = jobCard?.selectedPackage;
        const packageServices =
          packageObj?.servicesIncluded?.map((s) => s.name) || [];

        return {
          _id: review._id,
          customerName: review.customer?.name || "Anonymous",
          rating: review.rating,
          comment: review.comment,
          service: packageObj?.name || "General Service",
          includedServices: packageServices, // Used for filtering
          date: review.createdAt,
          adminReply: review.adminReply || null,
        };
      }),
    );

    // Filter by service if provided (client-side or server-side)
    let finalReviews = enrichedReviews;
    if (service && service !== "All Services") {
      finalReviews = enrichedReviews.filter(
        (r) => r.includedServices.includes(service) || r.service === service,
      );
    }

    return {
      stats: {
        average: Number(stats.averageRating.toFixed(1)),
        total: stats.totalReviews,
        distribution: {
          5: stats.star5,
          4: stats.star4,
          3: stats.star3,
          2: stats.star2,
          1: stats.star1,
        },
      },
      reviews: finalReviews,
      totalRemaining: Math.max(
        0,
        stats.totalReviews - (skip + finalReviews.length),
      ),
    };
  } catch (error) {
    throw new AppError(error.message || "Failed to fetch public reviews", 500);
  }
};

module.exports.addAdminReply = async (reviewId, payload) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const review = await Review.findOne({ _id: reviewId, isDeleted: false });
    if (!review) throw new AppError("Review not found", 404);

    if (review.adminReply) {
      throw new AppError(
        "Review already has an admin reply. Use update instead.",
        400,
      );
    }

    const { error } = validatedAdminReply(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    review.adminReply = payload.reply;
    await review.save();
    return "Admin reply added successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to add admin reply", 500);
  }
};

module.exports.updateAdminReply = async (reviewId, payload) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const review = await Review.findOne({ _id: reviewId, isDeleted: false });
    if (!review) throw new AppError("Review not found", 404);

    if (review.isApproved) {
      throw new AppError("Cannot update reply for an approved review", 403);
    }

    if (!review.adminReply) {
      throw new AppError("Review does not have an admin reply to update.", 404);
    }

    const { error } = validatedAdminReply(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    review.adminReply = payload.reply;
    await review.save();
    return "Admin reply updated successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to update admin reply", 500);
  }
};

module.exports.deleteAdminReply = async (reviewId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const review = await Review.findOne({ _id: reviewId, isDeleted: false });
    if (!review) throw new AppError("Review not found", 404);

    if (review.isApproved) {
      throw new AppError("Cannot delete reply for an approved review", 403);
    }

    if (!review.adminReply) {
      throw new AppError("Review does not have an admin reply to delete.", 404);
    }

    review.adminReply = undefined;
    await review.save();
    return "Admin reply deleted successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to delete admin reply", 500);
  }
};

module.exports.updateReviewApprovalStatus = async (reviewId, payload) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }

    const { error } = validatedReviewApproval(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const review = await Review.findOne({ _id: reviewId, isDeleted: false });
    if (!review) throw new AppError("Review not found", 404);

    review.isApproved = payload.isApproved;
    await review.save();
    return `Review ${payload.isApproved ? "approved" : "rejected"} successfully`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to update review approval status",
      500,
    );
  }
};

module.exports.getAllReviews = async (
  page = 1,
  limit = 10,
  isApproved = undefined,
) => {
  const filters = {
    isDeleted: false,
  };
  if (isApproved !== undefined) {
    filters.isApproved = isApproved;
  }
  try {
    const skip = (page - 1) * limit;
    const reviews = await Review.find(filters)
      .populate([
        {
          path: "customer",
          select: "name",
        },
        {
          path: "booking",
          populate: {
            path: "vehicle",
            populate: { path: "image", select: "filePath" },
            select: ["make", "model", "image"],
          },
          select: ["vehicle", "date"],
        },
      ])
      .select([
        "customer",
        "booking",
        "rating",
        "comment",
        "isApproved",
        "adminReply",
        "createdAt",
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    return reviews;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch reviews", 500);
  }
};

module.exports.getCustomerReviewById = async (reviewId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new AppError("Invalid review ID", 400);
    }
    const review = await Review.findOne({ _id: reviewId, isDeleted: false })
      .populate([
        {
          path: "customer",
          select: "name",
        },
        {
          path: "booking",
          populate: {
            path: "vehicle",
            populate: { path: "image", select: "filePath" },
            select: ["make", "model", "image"],
          },
          select: ["vehicle", "date"],
        },
      ])
      .select([
        "customer",
        "booking",
        "rating",
        "comment",
        "isApproved",
        "adminReply",
        "createdAt",
      ]);
    if (!review) throw new AppError("Review not found", 404);
    return review;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch review", 500);
  }
};
