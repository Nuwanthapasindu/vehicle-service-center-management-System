const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { JOBCARD_STATUS } = require("../util/constants");

const jobCardSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    status: {
      type: String,
      enum: Object.values(JOBCARD_STATUS),
      default: JOBCARD_STATUS.PENDING,
    },
    selectedPackage: {
      type: Schema.Types.ObjectId,
      ref: "Package",
    },
    milageCount: {
      type: Number,
      default: 0
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
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

module.exports = mongoose.model("JobCard", jobCardSchema);
