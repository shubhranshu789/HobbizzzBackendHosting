const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;



const artClubSchema = new mongoose.Schema(
  {
    district: { type: String, required: true },
    activities: [{ type: ObjectId, ref: "ACTIVITY" }],
    head: { type: ObjectId, ref: "CABINATE", default: null},
    members: [{ type: ObjectId, ref: "CABINATE" }],
    council: [{ type: ObjectId, ref: "CABINATE" }],
    memberRequests: [{ type: ObjectId, ref: "CABINATE" }], 
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "CABINATE" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ARTCLUB", artClubSchema);
