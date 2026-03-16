const Supplier = require('../model/Supplier');

exports.getAllSuppliers = async (req, res) => {
  try {
    // Delete wela nathi (isDeleted: false) ewun witharai list wenne
    const suppliers = await Supplier.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    // Database eken delete karanne na, isDeleted eka true karanawa (Soft Delete)
    await Supplier.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() });
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};