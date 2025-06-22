const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const requireLoginUser = require("../middleWares/requireLoginUser");

const DIRECTOR = mongoose.model("DIRECTOR");
const CHAPTER = mongoose.model("CHAPTER");
const artClub = mongoose.model("ARTCLUB");



router.post("/create-chapter", requireLoginUser, async (req, res) => {
  try {
    const { title, description, date, venue, club, district, status } = req.body;

    // Validate required fields
    if (!title || !date || !venue || !club || !district) {
      return res.status(400).json({ message: "Title, Date, Venue, Club, and District are required" });
    }

    // Fetch Director based on club
    const director = await DIRECTOR.findOne({ clubName: club });
    if (!director) {
      return res.status(404).json({ message: `Director not found for club: ${club}` });
    }

    // Fetch Art Club for given district and club
    const artClub = await club.findOne({ district });
    if (!artClub) {
      return res.status(404).json({ message: `Art club not found for district: ${district}` });
    }

    const head = artClub.head;
    const council_members = artClub.council;

    // Create new Chapter
    const newChapter = new CHAPTER({
      title,
      description,
      date,
      venue,
      club,
      district,
      status,
      head,
      director: director._id,
      council_members
    });

    const savedChapter = await newChapter.save();

    res.status(201).json({ message: "Chapter created successfully", chapter: savedChapter });

  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ message: "Failed to create chapter", error: error.message });
  }
});

module.exports = router;