const mongoose = require("mongoose");
const InventoryLog = require("../model/InventoryLog");
const AppError = require("../error/AppError");
const { logFilterSchema } = require("../validation/inventoryLogs.validation");
const { LOG_PERIODS } = require("../util/constants");

const calculateDateRange = (period, startDate, endDate, timezoneOffset) => {
  try {
    const query = {};
    const now = new Date();
    let start = null;
    let end = null;

    const userNow =
      timezoneOffset !== undefined && timezoneOffset !== null
        ? new Date(now.getTime() - timezoneOffset * 60000)
        : now;

    if (period) {
      switch (period.toLowerCase()) {
        case LOG_PERIODS.TODAY:
          start = new Date(userNow);
          start.setUTCHours(0, 0, 0, 0);
          end = new Date(userNow);
          end.setUTCHours(23, 59, 59, 999);
          break;

        case LOG_PERIODS.WEEKLY:
          start = new Date(userNow);
          start.setDate(start.getDate() - 7);
          start.setUTCHours(0, 0, 0, 0);
          break;

        case LOG_PERIODS.MONTHLY:
          start = new Date(userNow);
          start.setMonth(start.getMonth() - 1);
          start.setUTCHours(0, 0, 0, 0);
          break;

        case LOG_PERIODS.YEARLY:
          start = new Date(userNow);
          start.setFullYear(start.getFullYear() - 1);
          start.setUTCHours(0, 0, 0, 0);
          break;

        case LOG_PERIODS.CUSTOM:
          if (startDate) {
            start = new Date(startDate);
            start.setUTCHours(0, 0, 0, 0);
          }
          if (endDate) {
            end = new Date(endDate);
            end.setUTCHours(23, 59, 59, 999);
          }
          break;
      }

      if (
        period.toLowerCase() !== LOG_PERIODS.CUSTOM &&
        timezoneOffset !== undefined &&
        timezoneOffset !== null
      ) {
        if (start) start = new Date(start.getTime() + timezoneOffset * 60000);
        if (end) end = new Date(end.getTime() + timezoneOffset * 60000);
      }
    } else if (startDate || endDate) {
      if (startDate) {
        start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
      }
      if (endDate) {
        end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
      }
    }

    if (start || end) {
      query.createdAt = {};
      if (start) query.createdAt.$gte = start;
      if (end) query.createdAt.$lte = end;
    }

    return query;
  } catch (error) {
    throw new AppError("Invalid date filter", 400);
  }
};

// GET ALL LOGS
module.exports.getLogs = async (filters) => {
  try {
    const { error, value } = logFilterSchema.validate(filters);
    if (error) throw new AppError(error.details[0].message, 400);

    const {
      actionType,
      period,
      startDate,
      endDate,
      inventoryId,
      page = 1,
      limit = 20,
      timezoneOffset,
    } = value;

    let query = calculateDateRange(period, startDate, endDate, timezoneOffset);

    if (actionType) query.actionType = actionType;

    if (inventoryId) {
      if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
        throw new AppError("Invalid Inventory ID", 400);
      }
      query.inventory = inventoryId;
    }

    const logs = await InventoryLog.find(query)
      .populate({
        path: "inventory",
        select: "name unitType",
      })
      .populate({
        path: "performedBy",
        select: "name mobile",
      })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await InventoryLog.countDocuments(query);

    return {
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch inventory logs", 500);
  }
};

// GET LOGS BY INVENTORY ITEM
module.exports.getLogsByItem = async (inventoryId, filters) => {
  try {
    const { error, value } = logFilterSchema.validate({
      ...filters,
      inventoryId,
    });
    if (error) throw new AppError(error.details[0].message, 400);

    const {
      actionType,
      period,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      timezoneOffset,
    } = value;

    let query = calculateDateRange(period, startDate, endDate, timezoneOffset);
    query.inventory = inventoryId;

    if (actionType) query.actionType = actionType;

    const logs = await InventoryLog.find(query)
      .populate({
        path: "performedBy",
        select: "name mobile",
      })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await InventoryLog.countDocuments(query);

    return {
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch logs for item", 500);
  }
};
