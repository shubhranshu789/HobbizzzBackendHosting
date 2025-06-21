const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

const ARTCLUB = mongoose.model("ARTCLUB");
const {Jwt_secret} = require("../keys");
const requireLoginUser = require("../middleWares/requireLoginUser");
const requireLogin = require("../middleWares/requireLogin");
const CABINATE = mongoose.model("CABINATE");
const DIRECTOR = mongoose.model("DIRECTOR");
const APPROVEDMEMBER = mongoose.model("APPROVEDMEMBER");



//for joinning art club =========================================================================================
//=========================================================================================================
//===========================================================================================================


router.put("/artclub/requestjoin", requireLoginUser, async (req, res) => {
  try {
    const { district } = req.query;

    if (!district) {
      return res.status(400).json({ error: "District is required in query params" });
    }

    // Find the club by district
    const club = await ARTCLUB.findOne({ district });
    if (!club) {
      return res.status(404).json({ error: `No art club found for district: ${district}` });
    }

    // Add user to memberRequests
    const updatedClub = await ARTCLUB.findByIdAndUpdate(
      club._id,
      { $addToSet: { memberRequests: req.user._id } }, // avoid duplicates
      { new: true }
    );

    const hasRequested = updatedClub.memberRequests.map(id => id.toString()).includes(req.user._id.toString());

    res.json({
      message: "Join request sent",club: updatedClub,hasRequested
    });

  } catch (err) {
    console.error("Error in requestjoin:", err);
    res.status(500).json({ error: "Failed to request join" });
  }
});




router.put("/artclub/requestjoinforcouncil", requireLoginUser, async (req, res) => {
  try {
    const { district } = req.query;
    if (!district) {
      return res.status(400).json({ error: "District is required in query params" });
    }

    // Find the club by district
    const club = await ARTCLUB.findOne({ district });
    if (!club) {
      return res.status(404).json({ error: `No art club found for district: ${district}` });
    }

    const updatedClub = await ARTCLUB.findByIdAndUpdate(
      club._id,
      { $addToSet: { councilRequests: req.user._id } }, // avoid duplicates
      { new: true }
    );
    const hasRequested = updatedClub.councilRequests.includes(req.user._id.toString());

    res.json({ message: "Join request sent", club: updatedClub, hasRequested });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to request join" });
  }
});

router.put("/artclub/withdrawjoin", requireLoginUser, async (req, res) => {
  try {
    const clubId = "6852b1de00a4d1168f1465e4";

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

// END HERE     ====================================================================================================
//=========================================================================================================
//=========================================================================================================



// router.put("/artclub/requestjoin", requireLoginUser, async (req, res) => {
//   try {
//     // Step 1: Find the CABINATE member
//     const member = await CABINATE.findById(req.user._id);
//     if (!member) {
//       return res.status(404).json({ error: "Member not found" });
//     }

//     // Step 2: Get the district of the member and find the corresponding DIRECTOR
//     const { district } = member;
//     const director = await DIRECTOR.findOne({ district });
//     if (!director) {
//       return res.status(404).json({ error: `No director found in district: ${district}` });
//     }

//     // Step 3: Use fixed Art Club ID
//     const clubId = "684a8c32d27f1ad8681187d0";

//     const updatedClub = await ARTCLUB.findByIdAndUpdate(
//       clubId,
//       { $addToSet: { memberRequests: req.user._id } },
//       { new: true }
//     );

//     const hasRequested = updatedClub.memberRequests
//       .map((id) => id.toString())
//       .includes(req.user._id.toString());

//     res.json({
//       message: `Join request sent to Art Club director of ${district}`,
//       director: { name: director.name, email: director.email },
//       hasRequested,
//     });
//   } catch (err) {
//     console.error("Join request error:", err);
//     res.status(500).json({ error: "Failed to request join" });
//   }
// });








//Director ke lie h yeee!!!!
// router.put("/artclub/approve/:userId", requireLogin, async (req, res) => {
//   try {
//     const clubId = "6852b1de00a4d1168f1465e4";
//     const userId = req.params.userId;

//     const updatedClub = await ARTCLUB.findByIdAndUpdate(
//       clubId,
//       {
//         $pull: { memberRequests: userId },
//         $addToSet: { members: userId },
//       },
//       { new: true }
//     );

//     res.json({ message: "User approved", club: updatedClub });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to approve member" });
//   }
// });


//nilesh ne commit kiya hain abhi zaroorat nahi tha

// router.put("/artclub/approve/:userId", requireLogin, async (req, res) => {
//   try {
//     const clubId = "6852b1de00a4d1168f1465e4";
//     const userId = req.params.userId;                               

//     console.log("Starting approval for:", userId);

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     // Find user and get district
//     const user = await CABINATE.findById(userId).select("district");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     console.log("User found, district:", user.district);

//     // Check for duplicate approved member for the same district
//     const duplicate = await APPROVEDMEMBER.findOne({ club: clubId, district: user.district });
//     if (duplicate) {
//       return res.status(400).json({ message: `Head is already approved for this District ${user.district}` });
//     }

//     // Update club: pull request & add member
//     const updatedClub = await ARTCLUB.findByIdAndUpdate(
//       clubId,
//       {
//         $pull: { memberRequests: userId },
//         $addToSet: { members: userId },
//       },
//       { new: true }
//     );

//     console.log("Club updated:", updatedClub._id);

//     // Create entry in APPROVEDMEMBER
//     await APPROVEDMEMBER.create({ user: userId, club: clubId, district: user.district });

//     // Update user's club field in CABINATE to 'artclub'
//     await CABINATE.findByIdAndUpdate(userId, { club: "artclub" });

//     res.json({ message: "User approved and club assigned", club: updatedClub });

//   } catch (err) {
//     console.error("APPROVAL ERROR >>>>", err.stack || err);
//     res.status(500).json({ error: "Failed to approve member", detail: err.message });
//   }
// });



// router.put("/artclub/disapprove/:userId", requireLogin, async (req, res) => {
//   try {
//     const clubId = "6852b1de00a4d1168f1465e4";
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



//=========================================================================================================
//=========================================================================================================
// for head==================================================================================================


router.get("/artclub/head-request", async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ error: "District parameter is required" });
  }

  try {
     const club = await ARTCLUB.findOne({ district }).populate({
      path: "memberRequests",
      select: "name email district state createdAt"
    });

    if (!club) {
      return res.status(404).json({ message: "Art club not found" });
    }

    res.json(club.memberRequests);
  } catch (error) {
    console.error("Error fetching member requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Set head for a club
router.put("/artclub/approve-head", async (req, res) => {
  try {
    const userId = req.query.userid;
    const district = req.query.district;

    if (!userId || !district) {
      return res.status(400).json({ message: "User ID and District are required" });
    }

    // Find club by district and update councilRequests and council
    const updatedClub = await ARTCLUB.findOneAndUpdate(
      { district: district },
      {
        $pull: { memberRequests: userId },
        head: userId 
      },
      { new: true }
    );

    if (!updatedClub) {
      return res.status(404).json({ message: "Art club not found for the specified district" });
    }

    // Update the user's club field to 'artclub'
    const updatedUser = await CABINATE.findByIdAndUpdate(
      userId,
      { club: "artclub" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Head request approved successfully", club: updatedClub });
  } catch (err) {
    console.error("Error approving Head request:", err);
    res.status(500).json({ error: "Failed to approve Head request" });
  }
});


router.put("/artclub/disapprove-head", async (req, res) => {
  try {
    const userId = req.query.userid;
    const district = req.query.district;

    if (!userId || !district) {
      return res.status(400).json({ message: "User ID and District are required" });
    }



    const updatedClub = await ARTCLUB.findOneAndUpdate(
      { district: district },
      { $pull: { memberRequests: userId } },
      { new: true }
    );

    res.json({ message: "User disapproved", club: updatedClub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to disapprove member" });
  }
});


router.get("/artclub/gethead", async (req, res) => {
  const { district } = req.query;
  if (!district) {
    return res.status(400).json({ error: "District parameter is required" });
  }
  try {
    const clubDoc = await ARTCLUB.findOne({ district })
      .populate("head", "name email avatar school");

    if (!clubDoc) {
      return res.status(404).json({ error: "Art club not found for this district" });
    }
    res.status(200).json({
      message: "Head fetched successfully",
      head: clubDoc.head
    });

  } catch (err) {
    console.error("Error fetching club head:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//  end of head =============================================================================================
//=========================================================================================
//=========================================================================================================



//=========================================================================================================
//=========================================================================================================
// for council==================================================================================================

router.get("/artclub/council-requests", requireLoginUser, async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ message: "District parameter is required" });
  }

  try {
    const club = await ARTCLUB.findOne({ district }).populate({path: "councilRequests",select: "name email district state school createdAt"
    });

    if (!club) {
      return res.status(404).json({ message: "Art club not found for this district" });
    }

    res.status(200).json(club.councilRequests);
  } catch (error) {
    console.error("Error fetching council member requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/artclub/approve-council", requireLogin, async (req, res) => {
  try {
    const userId = req.query.userid;
    const district = req.query.district;

    if (!userId || !district) {
      return res.status(400).json({ message: "User ID and District are required" });
    }

    // Find club by district and update councilRequests and council
    const updatedClub = await ARTCLUB.findOneAndUpdate(
      { district: district },
      {
        $pull: { councilRequests: userId },
        $addToSet: { council: userId } 
      },
      { new: true }
    );

    if (!updatedClub) {
      return res.status(404).json({ message: "Art club not found for the specified district" });
    }

    // Update the user's club field to 'artclub'
    const updatedUser = await CABINATE.findByIdAndUpdate(
      userId,
      { club: "artclub" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Council request approved successfully", club: updatedClub });
  } catch (err) {
    console.error("Error approving council request:", err);
    res.status(500).json({ error: "Failed to approve council request" });
  }
});



router.put("/artclub/disapprove-council", requireLogin, async (req, res) => {
  try {
    const userId = req.query.userid;
    const district = req.query.district;

    if (!userId || !district) {
      return res.status(400).json({ message: "User ID and District are required" });
    }



    const updatedClub = await ARTCLUB.findOneAndUpdate(
      { district: district },
      { $pull: { councilRequests: userId } },
      { new: true }
    );

    res.json({ message: "User disapproved", club: updatedClub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to disapprove member" });
  }
});


router.get("/artclub/statusCouncil", requireLoginUser, async (req, res) => {
  try {
    const club = await ARTCLUB.findOne()
      .populate("council", "name email avatar") // populate selected fields
      .select("council councilRequests");

    if (!club) return res.status(404).json({ message: "Club not found" });

    res.json(club);
  } catch (err) {
    console.error("Error fetching club status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//=========================================================================================================
//=========================================================================================================
// end council==================================================================================================






router.get("/artclub/status", requireLogin, async (req, res) => {
  try {
    const clubId = "6852b1de00a4d1168f1465e4";

    const club = await ARTCLUB.findById(clubId)
      .populate("members", "name email avatar district") // populate selected fields
      .select("members memberRequests");

    if (!club) return res.status(404).json({ message: "Club not found" });

    res.json(club);
  } catch (err) {
    console.error("Error fetching club status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /artClub/info?district=Varanasi
router.get("/artclub/info", async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ error: "District parameter is required" });
  }

  try {
    const club = await ARTCLUB.findOne({ district });

    if (!club) {
      return res.status(404).json({ error: "Art club not found for this district" });
    }

    const response = {
      district: club.district,
      totalMembers: club.members,
      totalActivities: club.activities,
      pendingRequests: club.pendingRequests,
      memberRequests: club.memberRequests
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching art club info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/artclub/can-manage-council", requireLoginUser, async (req, res) => {
  try {
    const clubId = "6852b1de00a4d1168f1465e4"; // or pass dynamically
    const userId = req.user._id;

    const club = await ARTCLUB.findById(clubId).select("members");
    if (!club) return res.status(404).json({ message: "Club not found" });

    const isMember = club.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    res.json({ canManageCouncil: isMember });
  } catch (err) {
    console.error("Error checking council access:", err);
    res.status(500).json({ error: "Server error" });
  }
});










module.exports = router;