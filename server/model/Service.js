const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { VEHICLE_TYPES } = require("../util/constants");

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    prices: [
      {
        model: {
          type: String,
          enum: Object.values(VEHICLE_TYPES),
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    image: {
      type: Schema.Types.ObjectId,
      ref: "File",
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

module.exports = mongoose.model("Service", serviceSchema);
