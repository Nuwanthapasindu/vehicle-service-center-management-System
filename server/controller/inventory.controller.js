const Inventory = require('../model/Inventory');
const InventoryLog = require('../model/InventoryLog');
const User = require('../model/User');
const AppError = require('../error/AppError');
const { INVENTORY_ACTION_TYPES } = require('../util/constants');
const {
  inventorySchema,
  stockAdjustmentSchema,
} = require('../validation/inventory.validation');

const adjustStockInternal = async (
  inventoryId,
  change,
  actionType,
  userId,
  session = null
) => {
  const item = await Inventory.findOne({
    _id: inventoryId,
    isDeleted: false,
  }).session(session);

  if (!item) throw new AppError(`Inventory item ${inventoryId} not found`, 404);

  const oldQty = item.qty;

  if (oldQty + change < 0) throw new AppError("Insufficient stock", 400);

  item.qty = oldQty + change;

  await item.save({ session });

  await InventoryLog.create(
    [
      {
        inventory: inventoryId,
        actionType,
        quantityChange: change,
        previousStock: oldQty,
        stockBalance: item.qty,
        performedBy: userId,
      },
    ],
    { session }
  );

  return item;
};

module.exports.adjustStockHelper = adjustStockInternal;

const getUserIdByMobile = async (mobile) => {
  if (!mobile) throw new AppError("Mobile number is required", 400);

  const user = await User.findOne({
    mobile,
    isActive: true,
    isDeleted: false,
  })
    .select("_id")
    .lean();

  if (!user) throw new AppError("User not found", 404);

  return user._id;
};

// GET INVENTORY
module.exports.getInventory = async () => {
  return await Inventory.find({ isDeleted: false })
    .populate("category")
    .lean();
};

// ADD ITEM
module.exports.addItem = async (payload, authUser) => {
  const { error } = inventorySchema.validate(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const userId = await getUserIdByMobile(authUser.mobile);

  const item = await Inventory.create(payload);

  await InventoryLog.create({
    inventory: item._id,
    actionType: INVENTORY_ACTION_TYPES.RESTOCK,
    quantityChange: item.qty,
    previousStock: 0,
    stockBalance: item.qty,
    performedBy: userId,
  });

  return item;
};

// MANUAL ADJUSTMENT
module.exports.manualAdjustment = async (id, payload, authUser) => {
  const { error } = stockAdjustmentSchema.validate(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const userId = await getUserIdByMobile(authUser.mobile);

  return await adjustStockInternal(
    id,
    payload.quantityChange,
    INVENTORY_ACTION_TYPES.MANUAL_ADJUSTMENT,
    userId
  );
};

// REDUCE STOCK (INVOICE)
module.exports.reduceStockByInvoice = async (payload, authUser) => {
  const { items } = payload;

  if (!items || !Array.isArray(items) || !items.length)
    throw new AppError("No items provided", 400);

  const userId = await getUserIdByMobile(authUser.mobile);

  const promises = items.map((item) => {
    if (!item.inventoryId || !item.quantity)
      throw new AppError("Invalid item structure", 400);

    return adjustStockInternal(
      item.inventoryId,
      -Math.abs(item.quantity),
      INVENTORY_ACTION_TYPES.INVOICE_SALE,
      userId
    );
  });

  await Promise.all(promises);

  return true;
};

// INCREASE STOCK (PO)
module.exports.increaseStockByPO = async (payload, authUser) => {
  const { items } = payload;

  if (!items || !Array.isArray(items) || !items.length)
    throw new AppError("No items provided", 400);

  const userId = await getUserIdByMobile(authUser.mobile);

  const promises = items.map((item) => {
    if (!item.inventoryId || !item.quantityReceived)
      throw new AppError("Invalid item structure", 400);

    return adjustStockInternal(
      item.inventoryId,
      Math.abs(item.quantityReceived),
      INVENTORY_ACTION_TYPES.PO_RECEIVE,
      userId
    );
  });

  await Promise.all(promises);

  return true;
};

// UPDATE ITEM
module.exports.updateItem = async (id, payload) => {
  const item = await Inventory.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true }
  );

  if (!item) throw new AppError("Item not found", 404);

  return item;
};

// DELETE ITEM
module.exports.deleteItem = async (id) => {
  const item = await Inventory.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!item) throw new AppError("Item not found", 404);

  return true;
};