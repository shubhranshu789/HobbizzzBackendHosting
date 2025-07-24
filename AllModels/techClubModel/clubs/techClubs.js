const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const techClubSchema = new mongoose.Schema(
  {
    district: { type: String, required: true },
    state: { type: String, required: true },
    clubName: { type: String, default: "TECH" },
    activities: [{ type: ObjectId, ref: "TECHACTIVITY" }],
    head: { type: ObjectId, ref: "TECHCABINATE", default: null},
    members: [{ type: ObjectId, ref: "TECHCABINATE" }],
    memberRequests: [{ type: ObjectId, ref: "TECHCABINATE" }], 
    pendingRequests: [{ type: ObjectId, ref: "TECHCABINATE" }],
    director: [{ type: ObjectId, ref: "TECHDIRECTOR" }],
    ambassadors: [{ type: ObjectId, ref: "TECHCABINATE" }],
    ambassadorRequests: [{ type: ObjectId, ref: "TECHCABINATE" }],
    competitions: [{ type: ObjectId, ref: "TECHCOMPETITION" }],
    chapterStatus: {
      type: String,
      enum: ["Inactive", "Active"],
      default: "Inactive"
    } 
  },
  { timestamps: true }
);

mongoose.model("TECHCLUB", techClubSchema);