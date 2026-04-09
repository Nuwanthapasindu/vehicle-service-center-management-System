const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../util/constants");

const invoiceSchema = new Schema(
  {
    invoiceId: {
      type: String,
      unique: true,
      default: Date.now().toString(),
    },
    jobCard: {
      type: Schema.Types.ObjectId,
      ref: "Jobcard",
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    selectedPackage: {
      package: { type: Schema.Types.ObjectId, ref: "Package" },
      selectedPackageTier: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    },
    additionalItems: [
      {
        item: { type: Schema.Types.ObjectId, ref: "Inventory" },
        qty: { type: Number },
        sellingPrice: { type: Number },
        itemType: {
          type: String,
          enum: Object.values(constants.INVOICE_ITEM_TYPES),
          default: constants.INVOICE_ITEM_TYPES.OTHER,
        },
      },
    ],
    additionalServices: [
      {
        service: { type: Schema.Types.ObjectId, ref: "Service" },
        charge: { type: Number },
      },
    ],
    isCompleted: {
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

module.exports = mongoose.model("Invoice", invoiceSchema);
