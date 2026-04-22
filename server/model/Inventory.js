const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { INVENTORY_UNIT_TYPES } = require("../util/constants");

const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      default: 0,
    },
    unitType: {
      type: String,
      enum: Object.values(INVENTORY_UNIT_TYPES),
      required: true,
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    buyingPrice: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Inventory", inventorySchema);
