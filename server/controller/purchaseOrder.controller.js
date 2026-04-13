const PurchaseOrder = require('../model/PurchaseOrder');
const AppError = require('../error/AppError');
const { PURCHASE_ORDER_STATUS } = require('../util/constants');

/**
 * Create a new purchase order
 */
module.exports.createPurchaseOrder = async (payload) => {
  try {
    const newOrder = new PurchaseOrder(payload);
    const savedOrder = await newOrder.save();
    return savedOrder;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Get all purchase orders
 */
module.exports.getAllPurchaseOrders = async () => {
  try {
    const orders = await PurchaseOrder.find({ isDeleted: false })
      .populate('supplier', 'companyName')
      .populate('items.itemId', 'name')
      .sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Update a purchase order
 */
module.exports.updatePurchaseOrder = async (id, payload) => {
  if (!id) throw new AppError("Purchase order id is required", 400);

  if (payload.isDeleted !== undefined) delete payload.isDeleted;
  if (payload.deletedAt !== undefined) delete payload.deletedAt;

  try {
    const updatedOrder = await PurchaseOrder.findOneAndUpdate(
      { _id: id, isDeleted: false },
      payload,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      throw new AppError("Purchase Order not found", 404);
    }

    return "Purchase order updated successfully.";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Delete a purchase order
 */
module.exports.deletePurchaseOrder = async (id) => {
  if (!id) throw new AppError("Purchase order id is required", 400);

  try {
    const deletedOrder = await PurchaseOrder.updateOne(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: Date.now() }
    );

    if (!deletedOrder.modifiedCount) {
      throw new AppError("Purchase order not found", 404);
    }

    return "Purchase order deleted successfully.";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
