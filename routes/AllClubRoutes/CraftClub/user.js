const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const requireLogin = require("../middleWares/requireLogin");
const requireLoginUser = require("../middleWares/requireLoginUser");

// const CABINATE = mongoose.model("CABINATE");
const ACTIVITY = mongoose.model("ACTIVITY");
const CABINATE = mongoose.model("CABINATE");
const DIRECTOR = mongoose.model("DIRECTOR");



router.post("/create-activity", requireLoginUser, (req, res) => {
  const { title , desc,pic , category} = req.body;

  if (!title || !desc || !pic || !category) {
    console.log(category, title, desc , pic);
    return res.status(422).json({ error: "Please add all the fields" });
  }

  const event = new ACTIVITY({
    title,
    category,
    desc,
    pic,
    postedBy: req.user,
  });

  event
    .save()
    .then((result) => {
      return res.json({ event: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to create the post" });
    });
});

router.get("/allActivities", requireLoginUser, (req, res) => {
  ACTIVITY.find().then((events) => {
    res.json(events);
  });
});


router.get("/getactivity/:activityid" , (req,res) => {
  ACTIVITY.findOne({_id : req.params.activityid})
  .then(activity => {
      // console.log(activity)
      return res.json(activity)
  })
})



router.post("/register-activity-user/:activityId", requireLoginUser, async (req, res) => {
  const userId = req.user._id;
  const { activityId } = req.params;

  try {
    const activity = await ACTIVITY.findById(activityId);

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



router.post("/unregister-activity-user/:activityId", requireLoginUser, async (req, res) => {
  const userId = req.user._id;
  const { activityId } = req.params;

  try {
    const activity = await ACTIVITY.findById(activityId);

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


router.post("/upload-photo-user/:eventId", requireLoginUser, async (req, res) => {
  try {
    const { pic } = req.body;
    const userId = req.user._id.toString();
    const eventId = req.params.eventId;

    const event = await ACTIVITY.findById(eventId);
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

router.get("/has-uploaded-user/:eventId", requireLoginUser, async (req, res) => {
  const userId = req.user._id.toString();
  const eventId = req.params.eventId;

  const event = await ACTIVITY.findById(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const hasUploaded = event.uploads.some(
    (upload) => upload.uploadedBy.toString() === userId
  );

  res.status(200).json({ hasUploaded });
});



router.get("/event-participants-user/:eventId", requireLoginUser, async (req, res) => {
  try {
    const event = await ACTIVITY.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const registrations = event.Registrations;
    const uploadsMap = new Map();

    // Map uploadedBy => pic
    event.uploads.forEach(upload => {
      uploadsMap.set(upload.uploadedBy.toString(), upload.pic);
    });

    // Fetch user details for registered users
    const users = await DIRECTOR.find({ _id: { $in: registrations } })
      .select("_id name email ip");

    const participants = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      ip: user.ip,
      pic: uploadsMap.get(user._id.toString()) || null
    }));

    res.status(200).json({ participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});







module.exports = router;
