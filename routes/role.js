const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireUser = require("../middleWares/requireUser");


const DROLE = mongoose.model("DROLE");

// Register role application API
router.post("/applyRole",require,(req, res) => {
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

// Fetch all applications
router.get("/getApplications", (req, res) => {
    DROLE.find()
        .then(applications => res.json(applications))
        .catch(err => {
            console.error("Error fetching applications:", err);
            res.status(500).json({ error: "Failed to fetch applications", details: err });
        });
});



module.exports = router;
