const Inventory = require('../model/Inventory');

exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getLowStock = async (req, res) => {
  try {
    // Finds items where actual qty <= reorderLevel
    const lowStock = await Inventory.find({ $expr: { $lte: ["$qty", "$reorderLevel"] } });
    res.status(200).json(lowStock);
  } catch (error) { res.status(500).json({ error: error.message }); }
};