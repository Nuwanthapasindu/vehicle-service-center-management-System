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
        type: Schema.Types.ObjectId,
        ref: "Inventory",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Supplier", supplierSchema);
