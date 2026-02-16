const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
  {
    jobCard: {
      type: Schema.Types.ObjectId,
      ref: "Jobcard",
      required: true,
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
        qty:{type:Number},
        sellingPrice: { type: Number },
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
