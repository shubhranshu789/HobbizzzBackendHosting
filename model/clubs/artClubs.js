const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;



const artClubSchema = new mongoose.Schema(
  {
    activities: [{ type: ObjectId, ref: "ACTIVITY" }],
    members: [{ type: ObjectId, ref: "CABINATE" }],
    memberRequests: [{ type: ObjectId, ref: "CABINATE" }], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("ARTCLUB", artClubSchema);
