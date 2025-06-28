const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const requireLoginUser = require("../middleWares/requireLoginUser");

const DIRECTOR = mongoose.model("DIRECTOR");
const LOCALEVENT= mongoose.model("LOCALEVENT");
const ARTCLUB = mongoose.model("ARTCLUB");
const SCHOOL = mongoose.model("SCHOOL");
const USER = mongoose.model("USER");


// GET /get-school?district=Varanasi&club=artclub
router.get("/get-school", async (req, res) => {
  const { district, club } = req.query;

  if (!district || !club) {
    return res.status(400).json({ error: "Both 'district' and 'club' parameters are required" });
  }

  try {
    // Find schools by district and club, populate ambassador & captain details
    const schools = await SCHOOL.find({ district, club })
      .populate('ambassador', 'name email phone')
      .populate('captain', 'name email phone');

    if (!schools.length) {
      return res.status(404).json({ error: "No schools found for the given district and club" });
    }

    res.status(200).json({ schools });

  } catch (error) {
    console.error("Error fetching school info:", error);
    res.status(500).json({ error: "Failed to fetch school information" });
  }
});

// GET /get-students?club=artclub&district=Kanpur&school=St. Xavier's
router.get("/get-students", async (req, res) => {
  const { district, school } = req.query;

  // Validate required parameters
  if (!district || !school) {
    return res.status(400).json({ error: "club, district, and school parameters are required" });
  }

  try {
    // Find students with matching club, district, and school
    const students = await USER.find({
      district,
      school
    }).select('name email phone school district club');

    if (!students.length) {
      return res.status(404).json({ message: "No students found for the given criteria" });
    }

    res.status(200).json({ students });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});



router.get("/get-captain", async (req, res) => {
  const { district, club, school } = req.query;

  if (!district || !club || !school) {
    return res.status(400).json({ error: "district, club, and school are required" });
  }

  try {
    const result = await SCHOOL.findOne({ district, club, school })
      .populate("captain", "name email phone");

    if (!result) {
      return res.status(404).json({ error: "School not found" });
    }

    res.status(200).json({ captain: result.captain });
  } catch (error) {
    console.error("Error fetching captain:", error);
    res.status(500).json({ error: "Failed to fetch captain details" });
  }
});


router.get("/get-correspondent", async (req, res) => {
  const { district, club, school } = req.query;

  if (!district || !club || !school) {
    return res.status(400).json({ error: "district, club, and school are required" });
  }

  try {
    const result = await SCHOOL.findOne({ district, club, school })
      .populate("correspondent", "name email phone");

    if (!result) {
      return res.status(404).json({ error: "School not found" });
    }

    res.status(200).json({ correspondent: result.correspondent });
  } catch (error) {
    console.error("Error fetching correspondent:", error);
    res.status(500).json({ error: "Failed to fetch correspondent details" });
  }
});


router.put("/make-captain", async (req, res) => {
  const { district, club, school, studentId } = req.body;

  if (!district || !club || !school || !studentId) {
    return res.status(400).json({ error: "district, club, school and userId are required" });
  }

  try {
    const updatedSchool = await SCHOOL.findOneAndUpdate(
      { district, club, school },
      { captain: studentId },
      { new: true }
    ).populate("captain", "name email phone");

    if (!updatedSchool) {
      return res.status(404).json({ error: "School not found" });
    }

    res.status(200).json({ message: "Captain assigned successfully", school: updatedSchool });
  } catch (error) {
    console.error("Error assigning captain:", error);
    res.status(500).json({ error: "Failed to assign captain" });
  }
});



module.exports = router;