const Inventory = require('../model/Inventory');
const InventoryLog = require('../model/InventoryLog');
const User = require('../model/User');
const AppError = require('../error/appError');
const ResponseBuilder = require('../util/responseBuilder');
const { INVENTORY_ACTION_TYPES } = require('../util/constants');
const { inventorySchema, stockAdjustmentSchema } = require('../validation/inventory.validation');

const adjustStockInternal = async (inventoryId, change, actionType, userId, session = null) => {

    const item = await Inventory.findOne({ _id: inventoryId, isDeleted: false }).session(session);

    if (!item)
        throw new AppError(`Inventory item ${inventoryId} not found`, 404);

    const oldQty = item.qty;

    if (oldQty + change < 0)
        throw new AppError("Insufficient stock", 400);

    item.qty = oldQty + change;

    await item.save({ session });

    await InventoryLog.create([{
        inventory: inventoryId,
        actionType,
        quantityChange: change,
        previousStock: oldQty,
        stockBalance: item.qty,
        performedBy: userId
    }], { session });

    return item;
};

exports.adjustStockHelper = adjustStockInternal;

const getUserIdByMobile = async (mobileNumber) => {
    if (!mobileNumber) {
        throw new AppError("Mobile number is required", 400);
    }
    
    const user = await User.findOne({ mobileNumber, isActive: true, isDeleted: false })
        .select('_id')
        .lean();
    
    if (!user) {
        throw new AppError("User not found with this mobile number", 404);
    }
    
    return user._id;
};

exports.getInventory = async (req, res, next) => {
    try {

        const items = await Inventory
            .find({ isDeleted: false })
            .populate('category')
            .lean();

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Inventory fetched successfully",
            data: items
        });

    } catch (err) { next(err); }
};

exports.addItem = async (req, res, next) => {
    try {
        const { error } = inventorySchema.validate(req.body);
        if (error) return next(new AppError(error.details[0].message, 400));

        const userId = await getUserIdByMobile(req.user.mobile);
        
        const item = await Inventory.create(req.body);

        await InventoryLog.create({
            inventory: item._id,
            actionType: INVENTORY_ACTION_TYPES.RESTOCK,
            quantityChange: item.qty,
            previousStock: 0,
            stockBalance: item.qty,
            performedBy: userId
        });

        const response = new ResponseBuilder(res);
        response.setStatus(201);
        response.buildResponse({
            message: "Item added to inventory",
            data: item
        });

    } catch (err) { next(err); }
};

exports.manualAdjustment = async (req, res, next) => {
    try {
        const { error } = stockAdjustmentSchema.validate(req.body);
        if (error) return next(new AppError(error.details[0].message, 400));

        const userId = await getUserIdByMobile(req.user.mobile);
        
        const { id } = req.params;
        const { quantityChange } = req.body;

        const updatedItem = await adjustStockInternal(
            id,
            quantityChange,
            INVENTORY_ACTION_TYPES.MANUAL_ADJUSTMENT,
            userId
        );

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Manual stock adjustment successful",
            data: updatedItem
        });

    } catch (err) { next(err); }
};

exports.reduceStockByInvoice = async (req, res, next) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || !items.length)
            return next(new AppError("No items provided", 400));

        const userId = await getUserIdByMobile(req.user.mobile);

        const updatePromises = items.map(item => {
            if (!item.inventoryId || !item.quantity)
                throw new AppError("Invalid item structure", 400);

            return adjustStockInternal(
                item.inventoryId,
                -Math.abs(item.quantity),
                INVENTORY_ACTION_TYPES.INVOICE_SALE,
                userId
            );
        });

        await Promise.all(updatePromises);

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Stock reduced for invoice items"
        });

    } catch (err) { next(err); }
};

exports.increaseStockByPO = async (req, res, next) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || !items.length)
            return next(new AppError("No items provided", 400));

        const userId = await getUserIdByMobile(req.user.mobile);

        const updatePromises = items.map(item => {
            if (!item.inventoryId || !item.quantityReceived)
                throw new AppError("Invalid item structure", 400);

            return adjustStockInternal(
                item.inventoryId,
                Math.abs(item.quantityReceived),
                INVENTORY_ACTION_TYPES.PO_RECEIVE,
                userId
            );
        });

        await Promise.all(updatePromises);

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Stock increased for received Order items"
        });

    } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
    try {
        const item = await Inventory.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );

        if (!item)
            return next(new AppError("Item not found", 404));

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Item details updated",
            data: item
        });

    } catch (err) { next(err); }
};

exports.deleteItem = async (req, res, next) => {
    try {
        const item = await Inventory.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!item)
            return next(new AppError("Item not found", 404));

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Item removed from inventory"
        });

    } catch (err) { next(err); }
};