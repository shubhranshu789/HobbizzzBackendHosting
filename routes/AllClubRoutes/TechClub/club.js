const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {Jwt_secret} = require("../../../keys");


const requireLoginUser = require("../../../middleWares/requireLoginUserTech");

const TECHCLUB = mongoose.model("TECHCLUB");
const CABINATE = mongoose.model("TECHCABINATE");
const SCHOOL = mongoose.model("TECHSCHOOL");
const USER = mongoose.model("TECHUSER");



//for joinning tech club =========================================================================================
//=========================================================================================================
//===========================================================================================================


router.put("/techclub/requestjoin", requireLoginUser, async (req, res) => {
  try {
    const { district } = req.query;

    if (!district) {
      return res.status(400).json({ error: "District is required in query params" });
    }

    // Find the club by district
    const club = await TECHCLUB.findOne({ district });
    if (!club) {
      return res.status(404).json({ error: `No tech club found for district: ${district}` });
    }

    // Add user to memberRequests
    const updatedClub = await TECHCLUB.findByIdAndUpdate(
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




router.put("/techclub/requestjoinforambassador", requireLoginUser, async (req, res) => {
  try {
    const { district } = req.query;
    if (!district) {
      return res.status(400).json({ error: "District is required in query params" });
    }

    // Find the club by district
    const club = await TECHCLUB.findOne({ district });
    if (!club) {
      return res.status(404).json({ error: `No tech club found for district: ${district}` });
    }

    const updatedClub = await TECHCLUB.findByIdAndUpdate(
      club._id,
      { $addToSet: { ambassadorRequests: req.user._id } }, // avoid duplicates
      { new: true }
    );
    const hasRequested = updatedClub.ambassadorRequests.includes(req.user._id.toString());

    res.json({ message: "Join request sent", club: updatedClub, hasRequested });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to request join" });
  }
});

router.put("/techclub/withdrawjoin", requireLoginUser, async (req, res) => {
  try {
    const clubId = "6852b1de00a4d1168f1465e4";

    const updatedClub = await TECHCLUB.findByIdAndUpdate(
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



// router.put("/techclub/requestjoin", requireLoginUser, async (req, res) => {
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

//     // Step 3: Use fixed Tech Club ID
//     const clubId = "684a8c32d27f1ad8681187d0";

//     const updatedClub = await TECHCLUB.findByIdAndUpdate(
//       clubId,
//       { $addToSet: { memberRequests: req.user._id } },
//       { new: true }
//     );

//     const hasRequested = updatedClub.memberRequests
//       .map((id) => id.toString())
//       .includes(req.user._id.toString());

//     res.json({
//       message: `Join request sent to Tech Club director of ${district}`,
//       director: { name: director.name, email: director.email },
//       hasRequested,
//     });
//   } catch (err) {
//     console.error("Join request error:", err);
//     res.status(500).json({ error: "Failed to request join" });
//   }
// });








//Director ke lie h yeee!!!!
// router.put("/techclub/approve/:userId", requireLogin, async (req, res) => {
//   try {
//     const clubId = "6852b1de00a4d1168f1465e4";
//     const userId = req.params.userId;

//     const updatedClub = await TECHCLUB.findByIdAndUpdate(
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

// router.put("/techclub/approve/:userId", requireLogin, async (req, res) => {
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
//     const updatedClub = await TECHCLUB.findByIdAndUpdate(
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

//     // Update user's club field in CABINATE to 'techclub'
//     await CABINATE.findByIdAndUpdate(userId, { club: "techclub" });

//     res.json({ message: "User approved and club assigned", club: updatedClub });

//   } catch (err) {
//     console.error("APPROVAL ERROR >>>>", err.stack || err);
//     res.status(500).json({ error: "Failed to approve member", detail: err.message });
//   }
// });



// router.put("/techclub/disapprove/:userId", requireLogin, async (req, res) => {
//   try {
//     const clubId = "6852b1de00a4d1168f1465e4";
//     const userId = req.params.userId;

//     const updatedClub = await TECHCLUB.findByIdAndUpdate(
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


router.get("/techclub/head-request", async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ error: "District parameter is required" });
  }

  try {
     const club = await TECHCLUB.findOne({ district }).populate({
      path: "memberRequests",
      select: "name email district school state createdAt"
    });

    if (!club) {
      return res.status(404).json({ message: "Tech club not found" });
    }

    res.json(club.memberRequests);
  } catch (error) {
    console.error("Error fetching member requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Set head for a club
router.put("/techclub/approve-head", async (req, res) => {
  try {
    const userId = req.query.userid;
    const district = req.query.district;

    if (!userId || !district) {
      return res.status(400).json({ message: "User ID and District are required" });
    }

    // Find club by district and update councilRequests and council
    const updatedClub = await TECHCLUB.findOneAndUpdate(
      { district: district },
      {
        $pull: { memberRequests: userId },
        head: userId 
      },
      { new: true }
    );

    if (!updatedClub) {
      return res.status(404).json({ message: "Tech club not found for the specified district" });
    }

    // Update the user's club field to 'techclub'
    const updatedUser = await CABINATE.findByIdAndUpdate(
      userId,
      { club: "techclub" },
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


router.put("/techclub/disapprove-head", async (req, res) => {
  try {
    const userId = req.query.userid;
    const district = req.query.district;

    if (!userId || !district) {
      return res.status(400).json({ message: "User ID and District are required" });
    }



    const updatedClub = await TECHCLUB.findOneAndUpdate(
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


router.get("/techclub/gethead", async (req, res) => {
  const { district } = req.query;
  if (!district) {
    return res.status(400).json({ error: "District parameter is required" });
  }
  try {
    const clubDoc = await TECHCLUB.findOne({ district })
      .populate("head", "name email avatar school");

    if (!clubDoc) {
      return res.status(404).json({ error: "Tech club not found for this district" });
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
// for ambassadors==================================================================================================

router.get("/techclub/ambassador-requests", requireLoginUser, async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ message: "District parameter is required" });
  }

  try {
    const club = await TECHCLUB.findOne({ district }).populate({path: "ambassadorRequests",select: "name email district state school createdAt"
    });

    if (!club) {
      return res.status(404).json({ message: "Tech club not found for this district" });
    }

    res.status(200).json(club.ambassadorRequests);
  } catch (error) {
    console.error("Error fetching ambassador member requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/techclub/approve-ambassador", requireLoginUser, async (req, res) => {
  try {
    const userId = req.query.userid;
    const district = req.query.district;

    if (!userId || !district) {
      return res.status(400).json({ message: "User ID and District are required" });
    }

     // Find the user by ID to get school name
    const user = await CABINATE.findById(userId);

    const schoolName = user.school;

    // Check if SCHOOL entry already exists for this school in the given district and club
    const existingSchool = await SCHOOL.findOne({
      school: schoolName,
      district: district,
      club: 'techclub'
    });

    if (existingSchool) {
      return res.status(400).json({ message: "Ambassador already exists for this school in Techclub" });
    }

    // Create new SCHOOL entry
    const newSchool = await SCHOOL.create({
      school: schoolName,
      district: district,
      club: 'techclub',
      ambassador: userId,
      captain: null
    });

    // Find club by district and update ambassadorRequests and council
    const updatedClub = await TECHCLUB.findOneAndUpdate(
      { district: district },
      {
        $pull: { ambassadorRequests: userId },
        $addToSet: { ambassadors: userId } 
      },
      { new: true }
    );

    if (!updatedClub) {
      return res.status(404).json({ message: "Tech club not found for the specified district" });
    }

    // Update the user's club field to 'techclub'
    const updatedUser = await CABINATE.findByIdAndUpdate(
      userId,
      { club: "techclub" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "ambassador request approved successfully", club: updatedClub });
  } catch (err) {
    console.error("Error approving ambassador request:", err);
    res.status(500).json({ error: "Failed to approve ambassador request" });
  }
});



router.put("/techclub/disapprove-ambassador", requireLoginUser, async (req, res) => {
  try {
    const userId = req.query.userid;
    const district = req.query.district;

    if (!userId || !district) {
      return res.status(400).json({ message: "User ID and District are required" });
    }



    const updatedClub = await TECHCLUB.findOneAndUpdate(
      { district: district },
      { $pull: { ambassadorRequests: userId } },
      { new: true }
    );

    res.json({ message: "User disapproved", club: updatedClub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to disapprove member" });
  }
});


router.get("/techclub/statusambassador", requireLoginUser, async (req, res) => {
  try {
    const club = await TECHCLUB.findOne()
      .populate("ambassadors", "name email avatar") // populate selected fields
      .select("ambassadors ambassadorRequests");

    if (!club) return res.status(404).json({ message: "Club not found" });

    res.json(club);
  } catch (err) {
    console.error("Error fetching club status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//=========================================================================================================
//=========================================================================================================
// end ambassador==================================================================================================






router.get("/techclub/status", requireLoginUser, async (req, res) => {
  try {
    const clubId = "6852b1de00a4d1168f1465e4";

    const club = await TECHCLUB.findById(clubId)
      .populate("members", "name email avatar district") // populate selected fields
      .select("members memberRequests");

    if (!club) return res.status(404).json({ message: "Club not found" });

    res.json(club);
  } catch (err) {
    console.error("Error fetching club status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /techClub/info?district=Varanasi
router.get("/techclub/info", async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ error: "District parameter is required" });
  }

  try {
    const club = await TECHCLUB.findOne({ district });

    if (!club) {
      return res.status(404).json({ error: "Tech club not found for this district" });
    }
    // Fetch schools for this district and techclub
    const schools = await SCHOOL.find({ district, club: 'techclub' });

    // Fetch students for this district and techclub
    const students = await USER.find({ district, club: 'techclub' });


    // Prepare response object
    const response = {
      district: club.district,
      totalSchools: schools,
      totalActivities: club.activities,
      totalStudents: students,
      headRequests: club.memberRequests
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching tech club info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/techclub/can-manage-council", requireLoginUser, async (req, res) => {
  try {
    const clubId = "6852b1de00a4d1168f1465e4"; // or pass dynamically
    const userId = req.user._id;

    const club = await TECHCLUB.findById(clubId).select("members");
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