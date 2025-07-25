const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;



const craftClubSchema = new mongoose.Schema(
  {
    district: { type: String, required: true },
    activities: [{ type: ObjectId, ref: "PHOTOACTIVITY" }],
    head: { type: ObjectId, ref: "PHOTOCABINATE", default: null},
    members: [{ type: ObjectId, ref: "PHOTOCABINATE" }],
    memberRequests: [{ type: ObjectId, ref: "PHOTOCABINATE" }], 
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "PHOTOCABINATE" }],
    director: { type: ObjectId, ref: "PHOTODIRECTOR", required: false },
    ambassadors: { type: ObjectId, ref: "PHOTOCABINATE" },
    ambassadorRequests: [{ type: ObjectId, ref: "PHOTOCABINATE" }],
    chapterStatus: {
      type: String,
      enum: ["Inactive", "Active"],
      default: "Inactive"
    } 
  },
  { timestamps : true }
);

module.exports = mongoose.model("PHOTOCLUB", craftClubSchema);
