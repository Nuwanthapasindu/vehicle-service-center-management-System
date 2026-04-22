const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
  PURCHASE_ORDER_STATUS,
  INVENTORY_UNIT_TYPES,
} = require("../util/constants");

const purchaseOrderSchema = new Schema(
  {
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        qty: { type: Number, required: true },
        unitType: {
          type: String,
          enum: Object.values(INVENTORY_UNIT_TYPES),
          required: true,
        },
        cost: { type: Number },
      },
    ],
    status: {
      type: String,
      enum: Object.values(PURCHASE_ORDER_STATUS),
      default: PURCHASE_ORDER_STATUS.DRAFT,
    },
    expectedDate: {
      type: Date,
    },
    receivedDate: {
      type: Date,
    },
    isApproved: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
