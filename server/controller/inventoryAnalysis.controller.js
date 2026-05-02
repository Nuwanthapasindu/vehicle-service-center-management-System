const Inventory = require("../model/Inventory");
const InventoryLog = require("../model/InventoryLog");
const AppError = require("../error/AppError");
const {
  analysisFilterSchema,
} = require("../validation/inventoryAnalysis.validation");

// GET SUMMARY STATS
module.exports.getInventoryStats = async () => {
  try {
    const totalItems = await Inventory.countDocuments({
      isDeleted: false,
    });

    const lowStockItems = await Inventory.countDocuments({
      isDeleted: false,
      $expr: { $lte: ["$qty", "$reorderLevel"] },
    });

    const outOfStockItems = await Inventory.countDocuments({
      isDeleted: false,
      qty: 0,
    });

    const aggregateValue = await Inventory.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalStockValue: {
            $sum: { $multiply: ["$qty", "$buyingPrice"] },
          },
          totalPotentialRevenue: {
            $sum: { $multiply: ["$qty", "$sellingPrice"] },
          },
        },
      },
    ]);

    const stats = aggregateValue[0] || {
      totalStockValue: 0,
      totalPotentialRevenue: 0,
    };

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalStockValue: stats.totalStockValue,
      totalPotentialRevenue: stats.totalPotentialRevenue,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch inventory stats", 500);
  }
};

// GET CATEGORY BREAKDOWN
module.exports.getCategoryBreakdown = async () => {
  try {
    const breakdown = await Inventory.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails.name",
          count: { $sum: 1 },
          totalQty: { $sum: "$qty" },
          totalValue: {
            $sum: { $multiply: ["$qty", "$buyingPrice"] },
          },
        },
      },
      { $sort: { totalValue: -1 } },
    ]);

    return breakdown;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to fetch category breakdown",
      500,
    );
  }
};

// GET STOCK MOVEMENT (Last 30 days or dynamic)
module.exports.getStockMovement = async (filters = {}) => {
  try {
    const { error, value } = analysisFilterSchema.validate(filters);
    if (error) throw new AppError(error.details[0].message, 400);

    const { period, startDate, endDate } = value;

    let dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 30);

    if (period === "30days") {
      dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 30);
    } else if (startDate) {
      dateLimit = new Date(startDate);
    }

    const matchQuery = {
      createdAt: { $gte: dateLimit },
    };

    if (endDate) {
      matchQuery.createdAt.$lte = new Date(endDate);
    }

    const movement = await InventoryLog.aggregate([
      {
        $match: matchQuery,
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            actionType: "$actionType",
          },
          count: { $sum: 1 },
          totalChange: { $sum: "$quantityChange" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    return movement;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch stock movement", 500);
  }
};
