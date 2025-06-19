const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;


const approvedMemberSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "CABINATE", required: true },
    club: { type: ObjectId, ref: "ARTCLUB", required: true },
    district: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("APPROVEDMEMBER", approvedMemberSchema);
