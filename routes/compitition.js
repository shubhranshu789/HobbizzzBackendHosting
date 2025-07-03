const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const requireLogin = require("../middleWares/requireLogin");
const requireLoginUser = require("../middleWares/requireLoginUser");
const requireLoginPrinciple = require("../middleWares/requireLoginPrinciple");

// const CABINATE = mongoose.model("CABINATE");
const ACTIVITY = mongoose.model("ACTIVITY");
const CABINATE = mongoose.model("CABINATE");
const DIRECTOR = mongoose.model("DIRECTOR");
const ARTCLUB = mongoose.model("ARTCLUB");
const COMPITITION = mongoose.model("COMPITITION");
const USER = mongoose.model("USER");
const JUDGE = mongoose.model("JUDGE");





router.post("/create-compitition", requireLoginPrinciple, async (req, res) => {
  const { title, desc, pic } = req.body;

  if (!title || !desc || !pic ) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const event = new COMPITITION({
      title,
      desc,
      pic,
      postedBy: req.user,
    });

    const savedEvent = await event.save();

    // await ARTCLUB.findByIdAndUpdate(
    //   "684a8c32d27f1ad8681187d0",
    //   { $push: { activities: savedEvent._id } },
    //   { new: true }
    // );

    res.json({ event: savedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create the activity" });
  }
});



router.get("/allCompitition", (req, res) => {
  COMPITITION.find().then((events) => {
    res.json(events);
  });
});




router.get("/getCompitition/:compititionid", async (req, res) => {
  try {
    const competition = await COMPITITION.findOne({ _id: req.params.compititionid })
  .populate("uploads.uploadedBy", "name email")

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    res.json(competition);
  } catch (err) {
    console.error("Error fetching competition:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.delete("/competition/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await COMPITITION.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json({
      message: "Event deleted successfully",
      deletedEvent,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
});




router.put("/activity/set-live/:activityID", async (req, res) => {
  try {
    const activityId = req.params.activityID;
    const { isLive } = req.body;

    // ✅ Basic validation
    if (typeof isLive !== "boolean") {
      return res.status(400).json({ error: "`isLive` must be true or false" });
    }

    // ✅ Update the field
    const updated = await COMPITITION.findByIdAndUpdate(
      activityId,
      { isLive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json({
      message: `Activity is now ${isLive ? "LIVE ✅" : "OFFLINE ❌"}`,
      isLive: updated.isLive,
    });
  } catch (err) {
    console.error("Toggle error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




router.post("/register-compitition/:activityId", requireLogin, async (req, res) => {
  const userId = req.user._id;
  const { activityId } = req.params;

  try {
    const activity = await COMPITITION.findById(activityId);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }


    if (activity.Registrations.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    activity.Registrations.push(userId);
    await activity.save();

    res.status(200).json({ message: "Successfully registered", activity });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/unregister-compitition/:activityId", requireLogin, async (req, res) => {
  const userId = req.user._id;
  const { activityId } = req.params;

  try {
    const activity = await COMPITITION.findById(activityId);

    if (!activity) return res.status(404).json({ error: "Activity not found" });


    activity.Registrations = activity.Registrations.filter(
      (id) => id.toString() !== userId.toString()
    );

    await activity.save();

    res.status(200).json({ message: "Unregistered successfully", activity });
  } catch (err) {
    console.error("Unregister error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/upload-photo-compitition/:eventId", requireLogin, async (req, res) => {
  try {
    const { pic } = req.body;
    const userId = req.user._id.toString();
    const eventId = req.params.eventId;

    const event = await COMPITITION.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });


    const isRegistered = event.Registrations.includes(userId);
    if (!isRegistered) {
      return res.status(403).json({ error: "User not registered for this event" });
    }

    const alreadyUploaded = event.uploads.some(
      (upload) => upload.uploadedBy.toString() === userId
    );
    if (alreadyUploaded) {
      return res.status(409).json({ error: "You have already uploaded a photo for this event." });
    }


    event.uploads.push({ pic, uploadedBy: userId });
    await event.save();

    res.status(200).json({ success: true, message: "Photo uploaded successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/has-uploaded-compitition/:eventId", requireLogin, async (req, res) => {
  const userId = req.user._id.toString();
  const eventId = req.params.eventId;

  const event = await COMPITITION.findById(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const hasUploaded = event.uploads.some(
    (upload) => upload.uploadedBy.toString() === userId
  );

  res.status(200).json({ hasUploaded });
});


router.get("/event-participants-compi/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Find the competition by ID and select required fields
    const event = await COMPITITION.findById(eventId).select("Registrations uploads");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // 2. Create a map of uploadedBy => pic
    const uploadsMap = new Map();
    event.uploads.forEach(upload => {
      if (upload.uploadedBy) {
        uploadsMap.set(upload.uploadedBy.toString(), upload.pic);
      }
    });

    // 3. Fetch all registered users' details
    const users = await USER.find({ _id: { $in: event.Registrations } })
      .select("_id name email ip");

    // 4. Merge user info with their uploads (if any)
    const participants = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      ip: user.ip,
      pic: uploadsMap.get(user._id.toString()) || null
    }));

    return res.status(200).json({ participants });

  } catch (err) {
    console.error("Error fetching participants:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});




// -------------------------------------------Priciple-----------------------------------------------------------------------

router.get("/allJudges", async (req, res) => {
  try {
    const judges = await JUDGE.find();
    return res.status(200).json(judges);
  } catch (error) {
    console.error("Error fetching judges:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



router.post("/assignJudge", async (req, res) => {
  const { id, judgeId } = req.body;

  if (!id || !judgeId) {
    return res.status(400).json({ error: "competitionId and judgeId are required" });
  }

  try {
    const updated = await COMPITITION.findByIdAndUpdate(
      id,
      { $addToSet: { judges: judgeId } },
      { new: true }
    ).populate("judges", "name clubName");

    res.status(200).json({
      message: "Judge assigned successfully",
      competition: updated,
    });
  } catch (err) {
    console.error("Error assigning judge:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/competition/:id/judges", async (req, res) => {
  const { id } = req.params;

  try {
    const competition = await COMPITITION.findById(id).populate("judges", "name email clubName");

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    // Return only the judge data
    return res.status(200).json({ judges: competition.judges });
  } catch (err) {
    console.error("Error fetching judges:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});



router.post("/removeJudge", async (req, res) => {
  const { id, judgeId } = req.body;

  if (!id || !judgeId) {
    return res.status(400).json({ error: "competitionId and judgeId are required" });
  }

  try {
    const updatedCompetition = await COMPITITION.findByIdAndUpdate(
      id,
      { $pull: { judges: judgeId } },
      { new: true }
    ).populate("judges", "name email clubName");

    if (!updatedCompetition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    res.status(200).json({
      message: "Judge removed successfully",
      competition: updatedCompetition,
    });
  } catch (err) {
    console.error("Error removing judge:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------------------------------------------------------------------------------------------------------




// -------------------------------------------------JUDGE-----------------------------------------------------------------

router.get("/competitions/judge/:judgeId", async (req, res) => {
  const { judgeId } = req.params;

  try {
    const competitions = await COMPITITION.find({
      isLive: true,
      judges: judgeId, // match if judgeId is in the array
    })
    .populate("judges", "name email clubName") // optional
    .select("title desc pic isLive judges");     // optional, limits the fields returned

    res.status(200).json({ competitions });
  } catch (error) {
    console.error("Error fetching competitions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





router.patch("/assign-mark", async (req, res) => {
  const { uploadId, judgeId, mark } = req.body;

  if (!uploadId || !judgeId || typeof mark !== "number") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Map judgeId to judge field name
  let fieldToUpdate;
  switch (judgeId) {
    case "685d53b2537fff4608e05c67": // Judge 1 ID
      fieldToUpdate = "judge1";
      break;
    case "685c4be8c6a4e7621e7d1740":
      fieldToUpdate = "judge2";
      break;
    case "JUDGE3_ID":
      fieldToUpdate = "judge3";
      break;
    case "JUDGE4_ID":
      fieldToUpdate = "judge4";
      break;
    default:
      return res.status(403).json({ error: "Unauthorized judge" });
  }

  try {
    const updated = await COMPITITION.updateOne(
      { "uploads._id": uploadId },
      { $set: { [`uploads.$.${fieldToUpdate}`]: mark } }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ error: "Upload not found or mark not updated" });
    }

    res.status(200).json({ message: "Mark assigned successfully" });
  } catch (err) {
    console.error("Error assigning mark:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/:competitionId/upload/:uploadId/total-score", async (req, res) => {
  const { competitionId, uploadId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(competitionId) || !mongoose.Types.ObjectId.isValid(uploadId)) {
    return res.status(400).json({ error: "Invalid competition or upload ID" });
  }

  try {
    const competition = await COMPITITION.findById(competitionId);

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    const upload = competition.uploads.id(uploadId);

    if (!upload) {
      return res.status(404).json({ error: "Upload not found in competition" });
    }

    // Sum available judge scores (undefined treated as 0)
    const totalScore =
      (upload.judge1 || 0) +
      (upload.judge2 || 0) +
      (upload.judge3 || 0) +
      (upload.judge4 || 0);

    res.json({
      uploadId,
      totalScore,
      breakdown: {
        judge1: upload.judge1 || 0,
        judge2: upload.judge2 || 0,
        judge3: upload.judge3 || 0,
        judge4: upload.judge4 || 0
      }
    });
  } catch (error) {
    console.error("Error fetching upload score:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/:competitionId/uploads/total-scores", async (req, res) => {
  const { competitionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    return res.status(400).json({ error: "Invalid competition ID" });
  }

  try {
    const competition = await COMPITITION.findById(competitionId);

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    const uploadsWithScores = competition.uploads.map(upload => {
      const judge1 = upload.judge1 || 0;
      const judge2 = upload.judge2 || 0;
      const judge3 = upload.judge3 || 0;
      const judge4 = upload.judge4 || 0;

      return {
        uploadId: upload._id,
        totalScore: judge1 + judge2 + judge3 + judge4,
        breakdown: { judge1, judge2, judge3, judge4 },
        uploadedBy: upload.uploadedBy,
        pic: upload.pic,
        createdAt: upload.createdAt
      };
    });

    res.json(uploadsWithScores);
  } catch (error) {
    console.error("Error fetching upload scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/:competitionId/results", async (req, res) => {
  const { competitionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    return res.status(400).json({ error: "Invalid competition ID" });
  }

  try {
    const competition = await COMPITITION.findById(competitionId).populate("uploads.uploadedBy", "name email");

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    const results = competition.uploads.map(upload => {
      const judge1 = upload.judge1 || 0;
      const judge2 = upload.judge2 || 0;
      const judge3 = upload.judge3 || 0;
      const judge4 = upload.judge4 || 0;
      const totalScore = judge1 + judge2 + judge3 + judge4;

      return {
        uploadId: upload._id,
        pic: upload.pic,
        totalScore,
        breakdown: { judge1, judge2, judge3, judge4 },
        uploadedBy: upload.uploadedBy || null,
        createdAt: upload.createdAt
      };
    });

    // Sort by totalScore descending
    results.sort((a, b) => b.totalScore - a.totalScore);

    // Add ranks
    results.forEach((item, index) => {
      item.rank = index + 1;
    });

    res.json(results);
  } catch (error) {
    console.error("Error generating results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/:competitionId/generate-result", async (req, res) => {
  const { competitionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(competitionId)) {
    return res.status(400).json({ error: "Invalid competition ID" });
  }

  try {
    const updatedComp = await COMPITITION.findByIdAndUpdate(
      competitionId,
      { $set: { resultLive: true } },
      { new: true }
    );

    if (!updatedComp) {
      return res.status(404).json({ error: "Competition not found" });
    }

    res.json({
      message: "Result published successfully.",
      resultLive: updatedComp.resultLive,
      competitionId: updatedComp._id
    });
  } catch (error) {
    console.error("Error setting resultLive:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/competitions/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid competition ID" });
  }

  try {
    const competition = await COMPITITION.findById(id)
      .populate("postedBy", "name email")
      .populate("Registrations", "name email")
      .populate("judges", "name email")
      .populate("uploads.uploadedBy", "name email");

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    res.json(competition);
  } catch (error) {
    console.error("Error fetching competition:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});














module.exports = router;
