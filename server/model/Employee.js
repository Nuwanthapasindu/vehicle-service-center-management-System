const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { GENDERS } = require("../util/constants");

const employeeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    nic: {
      type: String,
      required: true,
      unique: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    gender: {
      type: String,
      enum: Object.values(GENDERS),
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true
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

module.exports = mongoose.model("Employee", employeeSchema);
