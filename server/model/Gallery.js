const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Gallery", gallerySchema);
