const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    applicableVehicalModels: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    pricingTiers: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    servicesIncluded: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    image: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    isPublished: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("Package", packageSchema);
