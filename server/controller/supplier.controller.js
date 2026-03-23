const Supplier = require('../model/Supplier'); 

//Add new Supplier
exports.createSupplier = async (req, res, next) => {
  try {
    const { companyName, agentName, companyMobile, items } = req.body;

    const newSupplier = new Supplier({
      companyName,
      agentName,
      companyMobile,
      items
    });

    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);

  } catch (error) {
    console.error("Create Supplier Error:", error);
    res.status(500).json({ message: "Server error while creating supplier." });
  }
};

//Get all Suppliers
exports.getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Fetch Suppliers Error:", error);
    res.status(500).json({ message: "Server error while fetching suppliers." });
  }
};

//Update Supplier
exports.updateSupplier = async (req, res, next) => {
  try {
    const supplierId = req.params.id;
    const { companyName, agentName, companyMobile, items } = req.body;

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      { companyName, agentName, companyMobile, items },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Update Supplier Error:", error);
    res.status(500).json({ message: "Server error while updating supplier." });
  }
};

//Delete Supplier
exports.deleteSupplier = async (req, res, next) => {
  try {
    const supplierId = req.params.id;

    const deletedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    res.status(200).json({ message: "Supplier deleted successfully." });
  } catch (error) {
    console.error("Delete Supplier Error:", error);
    res.status(500).json({ message: "Server error while deleting supplier." });
  }
};