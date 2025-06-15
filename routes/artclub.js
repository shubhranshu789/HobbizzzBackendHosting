const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

const ARTCLUB = mongoose.model("ARTCLUB");
const {Jwt_secret} = require("../keys");
const requireLoginUser = require("../middleWares/requireLoginUser");
const requireLogin = require("../middleWares/requireLogin");





// router.put("/artclub/requestjoin", requireLoginUser, async (req, res) => {
//   try {
//     const clubId = "684a8c32d27f1ad8681187d0";

//     const updatedClub = await ARTCLUB.findByIdAndUpdate(
//       clubId,
//       { $addToSet: { memberRequests: req.user._id } }, // avoid duplicates
//       { new: true }
//     );
//     const hasRequested = updatedClub.memberRequests.includes(req.user._id.toString());

//     res.json({ message: "Join request sent", club: updatedClub, hasRequested });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to request join" });
//   }
// });



const CABINATE = mongoose.model("CABINATE");
const DIRECTOR = mongoose.model("DIRECTOR");

router.put("/artclub/requestjoin", requireLoginUser, async (req, res) => {
  try {
    const clubId = "684a8c32d27f1ad8681187d0";

    // Step 1: Get requesting user's info (district, etc.)
    const member = await CABINATE.findById(req.user._id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const { district } = member;

    // Step 2: Find a director in that district
    const director = await DIRECTOR.findOne({ district });
    if (!director) {
      return res.status(404).json({ error: `No director found in district: ${district}` });
    }

    // Step 3: Add member to the club's memberRequests
    const updatedClub = await ARTCLUB.findByIdAndUpdate(
      clubId,
      { $addToSet: { memberRequests: req.user._id } },
      { new: true }
    );

    const hasRequested = updatedClub.memberRequests
      .map(id => id.toString())
      .includes(req.user._id.toString());

    // Step 4 (optional): You can also store the request somewhere under director
    // e.g., in a `directorRequests` field (you'd have to modify schema for this)

    res.json({
      message: `Join request sent to director of ${district}`,
      director: { name: director.name, email: director.email },
      hasRequested,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to request join" });
  }
});


router.put("/artclub/withdrawjoin", requireLoginUser, async (req, res) => {
  try {
    const clubId = "684a8c32d27f1ad8681187d0";

    const updatedClub = await ARTCLUB.findByIdAndUpdate(
      clubId,
      { $pull: { memberRequests: req.user._id } },
      { new: true }
    );

    res.json({ message: "Join request withdrawn", club: updatedClub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to withdraw join request" });
  }
});



//Director ke lie h yeee!!!!
router.put("/artclub/approve/:userId", requireLogin, async (req, res) => {
  try {
    const clubId = "684a8c32d27f1ad8681187d0";
    const userId = req.params.userId;

    const updatedClub = await ARTCLUB.findByIdAndUpdate(
      clubId,
      {
        $pull: { memberRequests: userId },
        $addToSet: { members: userId },
      },
      { new: true }
    );

    res.json({ message: "User approved", club: updatedClub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve member" });
  }
});


router.put("/artclub/disapprove/:userId", requireLogin, async (req, res) => {
  try {
    const clubId = "684a8c32d27f1ad8681187d0";
    const userId = req.params.userId;

    const updatedClub = await ARTCLUB.findByIdAndUpdate(
      clubId,
      { $pull: { memberRequests: userId } },
      { new: true }
    );

    res.json({ message: "User disapproved", club: updatedClub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to disapprove member" });
  }
});



router.get("/artclub/member-requests", requireLogin, async (req, res) => {
  try {
    const director = await DIRECTOR.findById(req.user._id);
    if (!director) {
      return res.status(401).json({ message: "Unauthorized: Not a director" });
    }

    const club = await ARTCLUB.findOne()
      .populate({
        path: "memberRequests",
        select: "name email district state createdAt", 
      });

    if (!club) {
      return res.status(404).json({ message: "Art club not found" });
    }

    const filteredRequests = club.memberRequests.filter(
      (member) => member.district === director.district
    );

    res.json(filteredRequests);
  } catch (error) {
    console.error("Error fetching member requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// router.get("/artclub/status",requireLogin , async (req, res) => {
//   try {
//     const club = await ARTCLUB.findOne().select("members memberRequests");

//     if (!club) return res.status(404).json({ message: "Club not found" });

//     res.json(club);
//   } catch (err) {
//     console.error("Error fetching club status:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.get("/artclub/status", requireLogin, async (req, res) => {
  try {
    const club = await ARTCLUB.findOne()
      .populate("members", "name email avatar") // populate selected fields
      .select("members memberRequests");

    if (!club) return res.status(404).json({ message: "Club not found" });

    res.json(club);
  } catch (err) {
    console.error("Error fetching club status:", err);
    res.status(500).json({ message: "Server error" });
  }
});













module.exports = router;