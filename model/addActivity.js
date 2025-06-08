const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    pic: { type: String, required: true },
    category: { type: String, required: true },
    postedBy: [{ type: ObjectId, ref: "CABINATE" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ACTIVITY", activitySchema);
