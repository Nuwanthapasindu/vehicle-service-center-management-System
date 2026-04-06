const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Timeslot",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    specialNote: {
      type: String,
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

// for prevent same slot booking at same day by same vehicle.
bookingSchema.index(
  { vehicle: 1, slot: 1, date: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

module.exports = mongoose.model("Booking", bookingSchema);
