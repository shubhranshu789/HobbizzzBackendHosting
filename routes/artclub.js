const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

const ARTCLUB = mongoose.model("ARTCLUB");
const {Jwt_secret} = require("../keys");
const requireLoginUser = require("../middleWares/requireLoginUser");





router.put("/artclub/requestjoin", requireLoginUser, async (req, res) => {
  try {
    const clubId = "684a8c32d27f1ad8681187d0";

    const updatedClub = await ARTCLUB.findByIdAndUpdate(
      clubId,
      { $addToSet: { memberRequests: req.user._id } }, // avoid duplicates
      { new: true }
    );
    const hasRequested = updatedClub.memberRequests.includes(req.user._id.toString());

    res.json({ message: "Join request sent", club: updatedClub, hasRequested });

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
router.put("/artclub/approve/:userId", requireLoginUser, async (req, res) => {
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


// router.put("/artclub/disapprove/:userId", requireLogin, async (req, res) => {
//   try {
//     const clubId = "684a8c32d27f1ad8681187d0";
//     const userId = req.params.userId;

//     const updatedClub = await ARTCLUB.findByIdAndUpdate(
//       clubId,
//       { $pull: { memberRequests: userId } },
//       { new: true }
//     );

//     res.json({ message: "User disapproved", club: updatedClub });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to disapprove member" });
//   }
// });

















module.exports = router;