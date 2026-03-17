const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  inventoryId: {
    type: Schema.Types.ObjectId,
    ref: "Inventory",
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  unitType: {
    type: String,
    default: "Nos",
  },
  price: {
    type: Number, 
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

// Main Order Schema
const orderSchema = new Schema(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [orderItemSchema], 
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Received"],
      default: "Draft",
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
  }
);

module.exports = mongoose.model("Order", orderSchema);