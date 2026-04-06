const Supplier = require('../model/Supplier');
const AppError = require('../error/AppError');
const {
  validatedCreateSupplier,
  validatedUpdateSupplier,
} = require('../validation/supplier.validation');

/**
 * Create a new supplier
 * @param {Object} payload - Supplier data
 * @returns {Promise<Object>} - Created supplier
 */
module.exports.createSupplier = async (payload) => {
  const { value, error } = validatedCreateSupplier(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  try {
    const existingSupplier = await Supplier.findOne({
      companyName: value.companyName,
      isDeleted: false,
    });
    
    if (existingSupplier) {
      throw new AppError("Supplier with this company name already exists", 400);
    }

    const newSupplier = new Supplier(value);
    const savedSupplier = await newSupplier.save();
    return savedSupplier;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Get all suppliers
 * @returns {Promise<Array>} - List of suppliers
 */
module.exports.getAllSuppliers = async () => {
  try {
    const suppliers = await Supplier.find({ isDeleted: false }).sort({ createdAt: -1 });
    return suppliers;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Update a supplier
 * @param {string} id - Supplier ID
 * @param {Object} payload - Update data
 * @returns {Promise<Object>} - Updated supplier
 */
module.exports.updateSupplier = async (id, payload) => {
  if (!id) throw new AppError("Supplier id is required", 400);

  // Prevent manual alteration of soft-delete statuses
  if (payload.isDeleted !== undefined) delete payload.isDeleted;
  if (payload.deletedAt !== undefined) delete payload.deletedAt;

  const { value, error } = validatedUpdateSupplier(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  try {
    if (value.companyName) {
      const existingSupplier = await Supplier.findOne({
        companyName: value.companyName,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (existingSupplier) {
        throw new AppError("Supplier company name already in use", 400);
      }
    }

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { _id: id, isDeleted: false },
      value,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier || updatedSupplier.isDeleted) {
      throw new AppError("Supplier not found", 404);
    }

    return "Supplier updated successfully.";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

/**
 * Delete a supplier
 * @param {string} id - Supplier ID
 * @returns {Promise<string>} - Success message
 */
module.exports.deleteSupplier = async (id) => {
  if (!id) throw new AppError("Supplier id is required", 400);

  try {
    const deletedSupplier = await Supplier.updateOne(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: Date.now() }
    );

    if (!deletedSupplier.modifiedCount) {
      throw new AppError("Supplier not found", 404);
    }

    return "Supplier deleted successfully.";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};