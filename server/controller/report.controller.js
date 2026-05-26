const Invoice = require("../model/Invoice");
const Review = require("../model/Review");
const JobCard = require("../model/JobCard");
const AppError = require("../error/AppError");
const {
  LOG_PERIODS: REPORT_RANGES,
  INVOICE_ITEM_TYPES,
} = require("../util/constants");

/**
 * Get Admin Review Report
 * Returns overall statistics and list of all reviews (approved & pending) for admin report.
 *
 * @param {Object} query - Object containing sort, page, limit
 * @returns {Promise<Object>} - Contains stats and array of raw reviews
 */
exports.getAdminReviewReport = async (query) => {
  try {
    const { sort = "recent", page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // 1. Calculate Stats (Overall, ignoring approval status but only undeleted)
    const statsResult = await Review.aggregate([
      { $match: { isDeleted: false } },
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
    let matchQuery = { isDeleted: false };
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
        let packageServices = [];
        let packageName = "General Service";

        if (review.booking?._id) {
          const jobCard = await JobCard.findOne({
            booking: review.booking._id,
            isDeleted: false,
          }).populate({
            path: "selectedPackage",
            populate: { path: "servicesIncluded", select: "name" },
          });

          if (jobCard && jobCard.selectedPackage) {
            packageName = jobCard.selectedPackage.name;
            packageServices =
              jobCard.selectedPackage.servicesIncluded?.map((s) => s.name) ||
              [];
          }
        }

        return {
          _id: review._id,
          customerName: review.customer?.name || "Anonymous",
          rating: review.rating,
          comment: review.comment,
          service: packageName,
          includedServices: packageServices, // Used for filtering
          date: review.createdAt,
          adminReply: review.adminReply || null,
        };
      }),
    );

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
      reviews: enrichedReviews,
      totalRemaining: Math.max(
        0,
        stats.totalReviews - (skip + enrichedReviews.length),
      ),
    };
  } catch (error) {
    throw new AppError(
      error.message || "Failed to fetch admin review report",
      500,
    );
  }
};

/**
 * Get Income Report
 * Calculates the total income over defined time ranges (today, weekly, monthly, yearly, custom)
 * Uses MongoDB Aggregation to dynamically compute virtual total prices.
 *
 * @param {Object} queryParams - Object containing range, startDate, endDate
 * @returns {Promise<Object>} - Contains totalIncome and data array
 */
exports.getIncomeReport = async (range, startDate, endDate) => {
  try {
    let start, end;
    const now = new Date();

    switch (range) {
      case REPORT_RANGES.TODAY:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        );
        break;
      case REPORT_RANGES.WEEKLY:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        );
        break;
      case REPORT_RANGES.MONTHLY:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
        end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        );
        break;
      case REPORT_RANGES.YEARLY:
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        );
        break;
      case REPORT_RANGES.CUSTOM:
        if (!startDate || !endDate) {
          throw new AppError(
            "startDate and endDate are required for custom range",
            400,
          );
        }
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        );
    }

    let groupByFormat = "%Y-%m-%d";
    if (range === REPORT_RANGES.YEARLY) {
      groupByFormat = "%Y-%m";
    } else if (range === REPORT_RANGES.CUSTOM) {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 60) groupByFormat = "%Y-%m";
    }

    const pipeline = [
      {
        $match: {
          isDeleted: false,
          isCompleted: true,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          calculatedTotal: {
            $add: [
              { $ifNull: ["$selectedPackage.selectedPackageTier.price", 0] },
              {
                $reduce: {
                  input: { $ifNull: ["$additionalServices", []] },
                  initialValue: 0,
                  in: { $add: ["$$value", { $ifNull: ["$$this.charge", 0] }] },
                },
              },
              {
                $reduce: {
                  input: {
                    $filter: {
                      input: { $ifNull: ["$additionalItems", []] },
                      as: "item",
                      cond: {
                        $eq: ["$$item.itemType", INVOICE_ITEM_TYPES.OTHER],
                      },
                    },
                  },
                  initialValue: 0,
                  in: {
                    $add: [
                      "$$value",
                      {
                        $multiply: [
                          { $ifNull: ["$$this.qty", 1] },
                          { $ifNull: ["$$this.sellingPrice", 0] },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupByFormat,
              date: "$createdAt",
            },
          },
          income: { $sum: "$calculatedTotal" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const results = await Invoice.aggregate(pipeline);
    const totalIncome = results.reduce((acc, curr) => acc + curr.income, 0);

    return {
      totalIncome,
      data: results,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to calculate income report", 500);
  }
};
