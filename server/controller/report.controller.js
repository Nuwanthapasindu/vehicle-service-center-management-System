const Invoice = require("../model/Invoice");
const AppError = require("../error/AppError");
const { LOG_PERIODS: REPORT_RANGES, INVOICE_ITEM_TYPES } = require("../util/constants");

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
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case REPORT_RANGES.WEEKLY:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case REPORT_RANGES.MONTHLY:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case REPORT_RANGES.YEARLY:
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case REPORT_RANGES.CUSTOM:
        if (!startDate || !endDate) {
          throw new AppError("startDate and endDate are required for custom range", 400);
        }
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
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
                      cond: { $eq: ["$$item.itemType", INVOICE_ITEM_TYPES.OTHER] },
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
