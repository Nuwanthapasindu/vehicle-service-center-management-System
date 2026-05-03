const Invoice = require("../model/Invoice");
const JobCard = require("../model/JobCard");
const User = require("../model/User");
const Package = require("../model/Package");
const Inventory = require("../model/Inventory");
const Service = require("../model/Service");
const AppError = require("../error/AppError");
const constants = require("../util/constants");
const {
  reduceStockByInvoice,
  increaseStockByPO,
} = require("./inventory.controller");
const {
  validatedCreateInvoice,
  validatedAddInvoiceItem,
  validatedRemoveInvoiceItem,
} = require("../validation/invoice.validation");
const mongoose = require("mongoose");

/**
 * Create a new invoice tied seamlessly to either a JobCard or a Walk-in Customer.
 * Validation strictly restricts allowing both JobCard and Customer concurrently.
 * Calculates references securely, throwing errors if any ObjectID lookup fails.
 *
 * @param {Object} payload - The request body payload from the client
 * @returns {Promise<string>} - Success message confirming creation
 * @throws {AppError} - Throws standard error codes like 400 for structural invalidity, 404 for missing entities, or 409 for conflicts.
 */
exports.createInvoice = async (payload) => {
  try {
    const saveData = {};
    // Validate request body
    const { error, value } = validatedCreateInvoice(payload);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
    // Process Customer conditionally
    if (value.customer) {
      if (!mongoose.Types.ObjectId.isValid(value.customer)) {
        throw new AppError("Invalid customer id", 400);
      }
      const customerExists = await User.findOne({
        _id: value.customer,
        isDeleted: false,
      });
      if (!customerExists) {
        throw new AppError("Customer not found", 404);
      }
      saveData.customer = customerExists._id;
    }

    // Process JobCard conditionally
    // If a JobCard is provided, we auto-extract the Customer from its booking.
    // Joi XOR validation guarantees a raw 'customer' property wasn't also sent.
    if (value.jobCard) {
      if (!mongoose.Types.ObjectId.isValid(value.jobCard)) {
        throw new AppError("Invalid job card id", 400);
      }
      const jobCardExists = await JobCard.findOne({
        _id: value.jobCard,
        isDeleted: false,
      }).populate({
        path: "booking",
        populate: {
          path: "customer",
          select: "_id",
        },
      });
      if (!jobCardExists) {
        throw new AppError("JobCard not found", 404);
      }

      // Check if an invoice already exists for this JobCard
      const existingInvoice = await Invoice.findOne({
        jobCard: value.jobCard,
        isDeleted: false,
      });
      if (existingInvoice) {
        throw new AppError("An invoice already exists for this JobCard", 409);
      }
      saveData.jobCard = jobCardExists._id;
      saveData.customer = jobCardExists.booking.customer._id;
    }

    // Verify referenced Package strictly
    if (value.selectedPackage && value.selectedPackage.package) {
      if (!mongoose.Types.ObjectId.isValid(value.selectedPackage.package)) {
        throw new AppError("Invalid package id", 400);
      }
      const packageExists = await Package.findOne({
        _id: value.selectedPackage.package,
        isDeleted: false,
      });
      if (!packageExists) {
        throw new AppError("Selected package not found", 404);
      }
    }

    if (value.additionalItems && value.additionalItems.length > 0) {
      for (const add of value.additionalItems) {
        const inventoryItem = await Inventory.findOne({
          _id: add.item,
          isDeleted: false,
        });
        if (!inventoryItem) throw new AppError(`Inventory item not found`, 404);
        if (inventoryItem.qty < add.qty) {
          throw new AppError(
            `Insufficient quantity for ${inventoryItem.itemName}. Only ${inventoryItem.qty} left.`,
            400,
          );
        }
        if (!add.sellingPrice || add.sellingPrice === 0)
          add.sellingPrice = inventoryItem.sellingPrice;
      }
      saveData.additionalItems = value.additionalItems;
    }

    if (value.additionalServices && value.additionalServices.length > 0) {
      for (const add of value.additionalServices) {
        const serviceItem = await Service.findOne({
          _id: add.service,
          isDeleted: false,
        });
        if (!serviceItem) throw new AppError(`Service not found`, 404);
      }
      saveData.additionalServices = value.additionalServices;
    }

    const newInvoice = new Invoice({
      ...saveData,
    });
    if (value.selectedPackage) {
      newInvoice.selectedPackage = value.selectedPackage;
    }
    await newInvoice.save();
    return {
      id: newInvoice._id,
      message: `Invoice created successfully ${newInvoice.invoiceId}`,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Failed to create invoice: ${error.message || "Unknown db error"}`,
      500,
    );
  }
};

/**
 * Native endpoint execution hook resolving Invoice bindings given an established JobCard ID reference.
 * Throws 404 cleanly if no Invoice was piped to the referenced ID.
 */
exports.getInvoiceByJobCard = async (jobCardId) => {
  if (!jobCardId)
    throw new AppError(
      "Invalid search parameters: JobCard ID is essentially required",
      400,
    );

  try {
    const invoice = await Invoice.findOne({
      jobCard: jobCardId,
      isDeleted: false,
    })
      .populate("customer", "name mobile")
      .populate("additionalItems.item", "name sku")
      .populate("additionalServices.service", "name category")
      .sort({ createdAt: -1 });

    if (!invoice)
      throw new AppError(
        "No Invoice organically found for the provided JobCard",
        404,
      );

    return invoice;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed terminating backend fetch schema for jobCard mapping",
      500,
    );
  }
};

/**
 * Fetches all non-deleted invoices within the database.
 * Allows optional boolean filtering natively through `queryOptions`,
 * and strictly populates relationship references to reduce client-side lookups.
 *
 * @param {Object} queryOptions - Extracted from `req.query` (e.g., isCompleted toggle)
 * @returns {Promise<Array>} - Mongoose object array containing all matched invoices
 * @throws {AppError} - Throws 500 automatically if document fetch operations crash.
 */
exports.getAllInvoices = async (queryOptions = {}) => {
  try {
    const filter = { isDeleted: false };

    // Apply isCompleted filter if provided in query
    if (queryOptions.isCompleted !== undefined) {
      filter.isCompleted =
        queryOptions.isCompleted === "true" ||
        queryOptions.isCompleted === true;
    }

    // Apply search filter for invoiceId if provided
    if (queryOptions.search && queryOptions.search.trim() !== "") {
      filter.invoiceId = { $regex: queryOptions.search.trim(), $options: "i" };
    }

    const invoices = await Invoice.find(filter)
      .populate([
        {
          path: "customer",
          select: ["name", "mobile"],
        },
        {
          path: "jobCard",
          select: ["booking", "-_id"],
          populate: {
            path: "booking",
            select: ["vehicle", "-_id"],
            populate: {
              path: "vehicle",
              select: ["licensePlate", "-_id"],
            },
          },
        },
      ])
      .select([
        "-__v",
        "-isDeleted",
        "-deletedAt",
        "-id",
        "-selectedPackage.package",
        "-additionalItems.item",
        "-additionalServices.service",
      ])
      .sort({ createdAt: -1 });

    return invoices;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to fetch invoices", 500);
  }
};

/**
 * Fetch a single invoice by its Object ID securely.
 *
 * @param {string} invoiceId - MongoDB Object ID of the invoice
 * @returns {Promise<Object>} - The invoice object
 * @throws {AppError} - Throws 400 for invalid ID, 404 for not found
 */
exports.getInvoiceById = async (invoiceId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new AppError("Invalid invoice ID provided", 400);
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, isDeleted: false })
      .populate([
        {
          path: "customer",
          select: ["name", "mobile", "email"],
        },
        {
          path: "jobCard",
          select: ["status", "booking", "milageCount", "-_id"],
          populate: {
            path: "booking",
            select: ["vehicle", "-_id"],
            populate: {
              path: "vehicle",
              select: [
                "-_id",
                "-createdAt",
                "-updatedAt",
                "-isDeleted",
                "-deletedAt",
                "-__v",
              ],
              populate: {
                path: "image",
                select: ["filePath", "-_id"],
              },
            },
          },
        },
        {
          path: "selectedPackage.package",
          select: ["name", "description", "-_id"],
        },
        {
          path: "additionalItems.item",
          select: [
            "-__v",
            "-createdAt",
            "-updatedAt",
            "-isDeleted",
            "-deletedAt",
          ],
        },
        {
          path: "additionalServices.service",
          select: [
            "-__v",
            "-createdAt",
            "-updatedAt",
            "-isDeleted",
            "-deletedAt",
          ],
        },
      ])
      .select(["-__v", "-isDeleted", "-deletedAt", "-id"]);

    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    return invoice;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to fetch the invoice", 500);
  }
};

/**
 * Add a new item or service to an existing invoice.
 *
 * @param {string} invoiceId - MongoDB Object ID of the invoice
 * @param {Object} payload - The update payload containing the type and data
 * @returns {Promise<string>} - Success message
 */
exports.addInvoiceItem = async (invoiceId, payload) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new AppError("Invalid invoice ID provided", 400);
    }

    const { error, value } = validatedAddInvoiceItem(payload);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Make sure the invoice physically exists and isn't logically deleted
    const invoice = await Invoice.findOne({ _id: invoiceId, isDeleted: false });
    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    // Lock modification block: We strictly prevent mutating an invoice once it's finalized
    if (invoice.isCompleted) {
      throw new AppError("Cannot modify items of a completed invoice", 400);
    }

    if (value.type === constants.INVOICE_UPDATE_TYPES.ITEM) {
      // Actively verify the inventory item physically exists before injecting it
      const inventoryItem = await Inventory.findOne({
        _id: value.data.item,
        isDeleted: false,
      });
      if (!inventoryItem) throw new AppError("Inventory item not found", 404);

      // Block insertion if physically available store quantities cannot fulfill the request
      if (inventoryItem.qty < value.data.qty) {
        throw new AppError(
          `Insufficient quantity. Only ${inventoryItem.qty} left in stock.`,
          400,
        );
      }

      // Automatically fallback to the explicit catalog price if none is manually requested
      if (value.data.sellingPrice === 0) {
        value.data.sellingPrice = inventoryItem.sellingPrice;
      }

      const existingItemIndex = invoice.additionalItems.findIndex(
        (i) => i.item.toString() === value.data.item,
      );

      if (existingItemIndex > -1) {
        // Update existing item attributes over pushing a duplicate
        invoice.additionalItems[existingItemIndex].qty = value.data.qty;
        invoice.additionalItems[existingItemIndex].sellingPrice =
          value.data.sellingPrice;
        if (value.data.itemType)
          invoice.additionalItems[existingItemIndex].itemType =
            value.data.itemType;
      } else {
        invoice.additionalItems.push(value.data);
      }
    } else if (value.type === constants.INVOICE_UPDATE_TYPES.SERVICE) {
      const serviceItem = await Service.findOne({
        _id: value.data.service,
        isDeleted: false,
      });
      if (!serviceItem) throw new AppError("Service not found", 404);

      const existingServiceIndex = invoice.additionalServices.findIndex(
        (s) => s.service.toString() === value.data.service,
      );

      if (existingServiceIndex > -1) {
        // Update existing service
        invoice.additionalServices[existingServiceIndex].charge =
          value.data.charge;
      } else {
        invoice.additionalServices.push(value.data);
      }
    }

    await invoice.save();
    return `${invoice?.invoiceId || "Invoice"} item updated successfully`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to add invoice item", 500);
  }
};

/**
 * Remove an item or service from an existing invoice.
 *
 * @param {string} invoiceId - MongoDB Object ID of the invoice
 * @param {Object} payload - The update payload containing the type and targetId
 * @returns {Promise<string>} - Success message
 */
exports.removeInvoiceItem = async (invoiceId, payload) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new AppError("Invalid invoice ID provided", 400);
    }

    const { error, value } = validatedRemoveInvoiceItem(payload);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, isDeleted: false });
    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    if (invoice.isCompleted) {
      throw new AppError("Cannot modify items of a completed invoice", 400);
    }

    let updateQuery = {};
    if (value.type === constants.INVOICE_UPDATE_TYPES.ITEM) {
      // Dynamically pull (remove) the nested sub-document that matches the target item ID
      updateQuery = { $pull: { additionalItems: { item: value.targetId } } };
    } else if (value.type === constants.INVOICE_UPDATE_TYPES.SERVICE) {
      updateQuery = {
        $pull: { additionalServices: { service: value.targetId } },
      };
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      updateQuery,
      { new: true },
    );
    return `${updatedInvoice?.invoiceId || "Invoice"} item removed successfully`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to remove invoice item", 500);
  }
};

/**
 * Complete an invoice and deduct inventory stock accordingly.
 * Syncs invoice items with inventory using specific external functions, and supports a manual rollback mechanism if the completion save explicitly fails.
 *
 * @param {string} invoiceId - MongoDB Object ID of the invoice
 * @param {Object} authUser - The authenticated user processing the completion
 * @returns {Promise<string>} - Success message
 */
exports.completeInvoice = async (invoiceId, authUser) => {
  let stockReduced = false;
  let previousJobCardStatus = null;
  let jobCardId = null;
  let inventoryItems = [];
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new AppError("Invalid invoice ID provided", 400);
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, isDeleted: false });
    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    jobCardId = invoice.jobCard;

    if (invoice.isCompleted) {
      throw new AppError("Invoice is already completed", 400);
    }

    // 1. Prepare items for inventory synchronization
    inventoryItems = (invoice.additionalItems || []).map((i) => ({
      inventoryId: i.item.toString(),
      quantity: i.qty,
    }));

    // 2. Reduce Stock
    if (inventoryItems.length > 0) {
      const payload = { items: inventoryItems };
      await reduceStockByInvoice(payload, authUser);
      stockReduced = true;
    }

    // 3. Update associated JobCard status to FINISH (storing previous status for rollback)
    if (jobCardId) {
      const jobCard = await JobCard.findById(jobCardId);
      if (jobCard) {
        previousJobCardStatus = jobCard.status;
        jobCard.status = constants.JOBCARD_STATUS.FINISH;
        await jobCard.save();
      }
    }

    // 4. Mark as completed
    invoice.isCompleted = true;
    await invoice.save();

    return `${invoice.invoiceId || "Invoice"} completed successfully`;
  } catch (error) {
    // A. Rollback JobCard status if it was changed
    if (previousJobCardStatus && jobCardId) {
      await JobCard.findByIdAndUpdate(jobCardId, {
        status: previousJobCardStatus,
      }).catch(console.error);
    }

    // B. Rollback Inventory Stock
    if (stockReduced) {
      const rollbackPayload = {
        items: inventoryItems.map((i) => ({
          inventoryId: i.inventoryId,
          quantityReceived: i.quantity,
        })),
      };
      // Auto-revert silently capturing errors
      await increaseStockByPO(rollbackPayload, authUser).catch(console.error);
    }

    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to complete invoice. System has attempted to safely revert all changes (Stock & Job Status).",
      500,
    );
  }
};
