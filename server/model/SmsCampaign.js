const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { MESSAGE_TYPES } = require("../util/constants");

const smsCampaignSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    campaignType: {
      type: String,
      enum: [MESSAGE_TYPES.PROMOTIONAL, MESSAGE_TYPES.TRANSACTIONAL],
      default: MESSAGE_TYPES.PROMOTIONAL,
    },
    recipientsCount: { type: Number, required: true },
    sentBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gatewayResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SmsCampaign", smsCampaignSchema);
