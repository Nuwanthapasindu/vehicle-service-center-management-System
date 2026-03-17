const Inventory = require('../model/Inventory');

exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getLowStock = async (req, res) => {
  try {
    const lowStock = await Inventory.find({ $expr: { $lte: ["$qty", "$reorderLevel"] } });
    res.status(200).json(lowStock);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.adjustStockHelper = async (inventoryId, change, actionType) => {
  try {
    if (actionType === 'PO_RECEIVE') {
      console.log(`\n---> [STOCK UPDATE TRYING] Inventory ID: ${inventoryId} | Qty to add: +${change}`);
      
      const updatedItem = await Inventory.findByIdAndUpdate(
        inventoryId, 
        { $inc: { qty: change } },
        { new: true } 
      );
      
      if (updatedItem) {
        console.log("---> [STOCK UPDATE SUCCESS] New Qty is:", updatedItem.qty, "\n");
      } else {
        console.log("---> [STOCK UPDATE FAILED] Item not found in DB! Check if this ID actually exists.\n");
      }
    }
  } catch (error) {
    console.error("Temp Helper Error:", error);
  }
}; 