const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    companyMobile: [
      {
        type: String,
      },
    ],
    agentName: {
      type: String,
    },
    agentMobile: [
      {
        type: String,
      },
    ],
    items: [
      {
        type: String,
      },
    ],
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

module.exports = mongoose.model("Supplier", supplierSchema);
