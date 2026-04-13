const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");
const constants = require("../util/constants");

const invoiceSchema = new Schema(
  {
    invoiceId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    jobCard: {
      type: Schema.Types.ObjectId,
      ref: "JobCard",
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);

invoiceSchema.virtual("totalPrice").get(function () {
  let total = 0;

  // Add selected package price
  if (
    this.selectedPackage &&
    this.selectedPackage.selectedPackageTier &&
    this.selectedPackage.selectedPackageTier.price
  ) {
    total += this.selectedPackage.selectedPackageTier.price;
  }

  // Add additional services charge
  if (this.additionalServices && this.additionalServices.length > 0) {
    this.additionalServices.forEach((service) => {
      if (service.charge) {
        total += service.charge;
      }
    });
  }

  // Add additional items (excluding OIL because that value is covered inside the package)
  if (this.additionalItems && this.additionalItems.length > 0) {
    this.additionalItems.forEach((item) => {
      if (item.itemType === constants.INVOICE_ITEM_TYPES.OTHER) {
        const qty = item.qty || 1;
        const price = item.sellingPrice || 0;
        total += qty * price;
      }
    });
  }

  return total;
});


module.exports = mongoose.model("Invoice", invoiceSchema);
