const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { INVENTORY_ACTION_TYPES } = require("../util/constants");

const inventoryLogSchema = new Schema(
  {
    inventory: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    actionType: {
      type: String,
      enum: Object.values(INVENTORY_ACTION_TYPES),
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    stockBalance: {
      type: Number,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("InventoryLog", inventoryLogSchema);
