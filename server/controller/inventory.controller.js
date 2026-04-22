const Inventory = require("../model/Inventory");
const InventoryLog = require("../model/InventoryLog");
const User = require("../model/User");
const AppError = require("../error/AppError");
const { INVENTORY_ACTION_TYPES } = require("../util/constants");
const {
  inventorySchema,
  stockAdjustmentSchema,
} = require("../validation/inventory.validation");

const adjustStockInternal = async (inventoryId, change, actionType, userId) => {
  try {
    const item = await Inventory.findOne({
      _id: inventoryId,
      isDeleted: false,
    });

    if (!item)
      throw new AppError(`Inventory item ${inventoryId} not found`, 404);

    const oldQty = item.qty;

    if (oldQty + change < 0) throw new AppError("Insufficient stock", 400);

    item.qty = oldQty + change;

    await item.save();

    await InventoryLog.create({
      inventory: inventoryId,
      actionType,
      quantityChange: change,
      previousStock: oldQty,
      stockBalance: item.qty,
      performedBy: userId,
    });

    return item;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Stock adjustment failed", 500);
  }
};

module.exports.adjustStockHelper = adjustStockInternal;

// GET INVENTORY
module.exports.getInventory = async (search, names) => {
  const query = {
    isDeleted: false,
  };

  if (search) {
    query.name = { $regex: new RegExp(search.trim(), "i") };
  }

  if (names && Array.isArray(names) && names.length > 0) {
    query.name = { $in: names };
  }

  try {
    return await Inventory.find(query)
      .populate({
        path: "category",
        select: "name",
      })
      .lean();
  } catch (error) {
    throw new AppError(error.message || "Failed to fetch inventory", 500);
  }
};

// ADD ITEM
module.exports.addItem = async (payload, authUser) => {
  try {
    const { error } = inventorySchema.validate(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const user = await User.findOne({
      mobile: authUser.mobile,
      isActive: true,
      isDeleted: false,
    })
      .select("_id")
      .lean();

    if (!user) throw new AppError("User not found", 404);

    const existingItem = await Inventory.findOne({
      name: { $regex: new RegExp(`^${payload.name.trim()}$`, "i") },
      isDeleted: false,
    });

    if (existingItem) {
      throw new AppError("Item with this name already exists", 409);
    }

    const item = await Inventory.create(payload);

    await InventoryLog.create({
      inventory: item._id,
      actionType: INVENTORY_ACTION_TYPES.RESTOCK,
      quantityChange: item.qty,
      previousStock: 0,
      stockBalance: item.qty,
      performedBy: user._id,
    });

    return `${item.name} added successfully.`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to add item", 500);
  }
};

// MANUAL ADJUSTMENT
module.exports.manualAdjustment = async (id, payload, authUser) => {
  try {
    const { error } = stockAdjustmentSchema.validate(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const user = await User.findOne({
      mobile: authUser.mobile,
      isActive: true,
      isDeleted: false,
    })
      .select("_id")
      .lean();

    if (!user) throw new AppError("User not found", 404);

    const result = await adjustStockInternal(
      id,
      payload.quantityChange,
      INVENTORY_ACTION_TYPES.MANUAL_ADJUSTMENT,
      user._id,
    );

    return `${result.name} adjusted successfully.`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Manual adjustment failed", 500);
  }
};

// REDUCE STOCK (INVOICE)
module.exports.reduceStockByInvoice = async (payload, authUser) => {
  try {
    const { items } = payload;

    if (!items || !Array.isArray(items) || !items.length)
      throw new AppError("No items provided", 400);

    const user = await User.findOne({
      mobile: authUser.mobile,
      isActive: true,
      isDeleted: false,
    })
      .select("_id")
      .lean();

    if (!user) throw new AppError("User not found", 404);

    const promises = items.map((item) => {
      if (!item.inventoryId || !item.quantity)
        throw new AppError(
          "Each item must include a valid inventory ID and received quantity",
          400,
        );

      return adjustStockInternal(
        item.inventoryId,
        -Math.abs(item.quantity),
        INVENTORY_ACTION_TYPES.INVOICE_SALE,
        user._id,
      );
    });

    await Promise.all(promises);

    return "Stock reduced successfully for invoice.";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Invoice stock reduction failed", 500);
  }
};

// INCREASE STOCK (PO)
module.exports.increaseStockByPO = async (payload, authUser) => {
  try {
    const { items } = payload;

    if (!items || !Array.isArray(items) || !items.length)
      throw new AppError("No items provided", 400);

    const user = await User.findOne({
      mobile: authUser.mobile,
      isActive: true,
      isDeleted: false,
    })
      .select("_id")
      .lean();

    if (!user) throw new AppError("User not found", 404);

    const promises = items.map((item) => {
      if (
        !item.inventoryId ||
        item.quantityReceived === undefined ||
        item.quantityReceived === null
      ) {
        throw new AppError(
          "Each item must include inventory ID and quantity received",
          400,
        );
      }

      if (
        typeof item.quantityReceived !== "number" ||
        item.quantityReceived < 0
      ) {
        throw new AppError(
          "Quantity received must be a non-negative number",
          400,
        );
      }

      return adjustStockInternal(
        item.inventoryId,
        item.quantityReceived,
        INVENTORY_ACTION_TYPES.PO_RECEIVE,
        user._id,
      );
    });

    await Promise.all(promises);

    return "Stock increased successfully from purchase order.";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "PO stock increase failed", 500);
  }
};

// UPDATE ITEM
module.exports.updateItem = async (id, payload) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { _id: id, isDeleted: false },
      payload,
      { new: true },
    );

    if (!item) throw new AppError("Item not found", 404);

    return `${item.name} updated successfully.`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to update item", 500);
  }
};

// DELETE ITEM
module.exports.deleteItem = async (id) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );

    if (!item) throw new AppError("Item not found", 404);

    return `${item?.name || "Item"} deleted successfully.`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to delete item", 500);
  }
};
