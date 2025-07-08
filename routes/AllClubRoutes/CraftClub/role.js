const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireUser = require("../../../middleWares/requireUser");


const DROLE = mongoose.model("CRAFTDROLE");
const DISTRICT = mongoose.model("CRAFTDISTRICT");

// Register role application API
router.post("/craftapplyRole",require,(req, res) => {
    const { club, interest, school, district, state } = req.body;

    if (!club || !interest || !school || !district || !state) {
        return res.status(422).json({ error: "Please fill all required fields" });
    }

    const application = new DROLE({
        appliedBy: req.user,
        club,
        interest,
        school,
        district,
        state
    });

    application.save()
        .then(result => res.json({ message: "Application submitted", data: result }))
        .catch(err => {
            console.error("Error submitting application:", err);
            res.status(500).json({ error: "Failed to submit application", details: err });
        });
});

// GET /districtinfo?name=Varanasi
router.get("/craftdistrictinfo", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "District name is required" });
  }

  try {
    const district = await DISTRICT.findOne({ name });

    if (!district) {
      return res.status(404).json({ error: "District not found" });
    }

    res.status(200).json(district);
  } catch (error) {
    console.error("Error fetching district info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





// Fetch applied council members for same district (excluding head)
router.get("/craftgetAppliedCouncil/:headId", async (req, res) => {
    try {
        const headId = req.params.headId;

        // Fetch head's application to get their district
        const headApplication = await DROLE.findById(headId);

        if (!headApplication) {
            return res.status(404).json({ error: "Head not found" });
        }

        const district = headApplication.district;

        // Find all applications from same district and role !== 'head'
        const councilApplications = await DROLE.find({
            district: district,
            role: { $ne: "head" }   // not equal to 'head'
        });

        res.json(councilApplications);

    } catch (err) {
        console.error("Error fetching council applications:", err);
        res.status(500).json({ error: "Failed to fetch applications", details: err });
    }
});


// GET /getteachers?district=Kanpur
router.get("/craftgetteachers", async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ error: "District name is required" });
  }

  try {
    const teachers = await DROLE.find({
      district: new RegExp(`^${district.trim()}$`, "i"),
      status: "approved",
      interest: "district head"
    });

    if (teachers.length === 0) {
      return res.status(404).json({ message: "No approved district heads found in this district." });
    }

    res.status(200).json(teachers);

  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ error: "Failed to fetch teachers", details: err });
  }
});



// Set as Head API
router.put("/craftsethead/:id", (req, res) => {
    DROLE.findByIdAndUpdate(
        req.params.id,
        { $set: { role: "head" } },
        { new: true }
    )
    .then(updatedApplication => {
        if (!updatedApplication) {
            return res.status(404).json({ error: "Application not found" });
        }
        res.json({ message: "Role set as Head", data: updatedApplication });
    })
    .catch(err => {
        console.error("Error updating to head:", err);
        res.status(500).json({ error: "Failed to update role", details: err });
    });
});

// Set as Council API
router.put("/craftsetcouncil/:id", (req, res) => {
    DROLE.findByIdAndUpdate(
        req.params.id,
        { $set: { role: "council" } },
        { new: true }
    )
    .then(updatedApplication => {
        if (!updatedApplication) {
            return res.status(404).json({ error: "Application not found" });
        }
        res.json({ message: "Role set as Council", data: updatedApplication });
    })
    .catch(err => {
        console.error("Error updating to council:", err);
        res.status(500).json({ error: "Failed to update role", details: err });
    });
});



module.exports = router;
