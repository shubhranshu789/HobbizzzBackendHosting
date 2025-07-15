const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// const requireLoginUser = require("../middleWares/requireLoginUser");
const requireLoginUser = require("../../../middleWares/requireLoginUser");

const DIRECTOR = mongoose.model("DIRECTOR");
const LOCALEVENT= mongoose.model("LOCALEVENT");
const ARTCLUB = mongoose.model("ARTCLUB");


// GET /get-chapter?club=artclub&district=Varanasi
router.get("/get-events", async (req, res) => {
  try {
    const { club, district } = req.query;

    const query = {};
    if (club) query.club = club;
    if (district) query.district = district;

    const events = await LOCALEVENT.find(query)
      .populate("director", "name email")
      .populate("head", "name email")
      .populate("council_members", "name position email phone")
      .sort({ createdAt: -1 }); // newest first

    const formattedEvents = events.map((chapter) => ({
      event_id: chapter._id,
      image: chapter.image,
      title: chapter.title,
      date: chapter.date,
      venue: chapter.venue,
      description: chapter.description || "",
      status: chapter.status,
      created_at: chapter.createdAt,
      updated_at: chapter.updatedAt,
      club_name: chapter.club,
      club_director_name: chapter.director ? chapter.director.name : "N/A",
      club_director_email: chapter.director ? chapter.director.email : "N/A",
      district_name: chapter.district,
      district_head_name: chapter.head ? chapter.head.name : "N/A",
      district_head_email: chapter.head ? chapter.head.email : "N/A",
  
    }));

    res.status(200).json({ events: formattedEvents });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
});




router.post("/create-chapter", requireLoginUser, async (req, res) => {
  const clubModels = {
    "artclub": ARTCLUB
  };


  try {
    const { title, description, date, venue, club, district, status, image } = req.body;

    // Validate required fields
    if (!title || !date || !venue || !club || !district) {
      return res.status(400).json({ message: "Title, Date, Venue, Club, and District are required" });
    }

    // Fetch Director based on club
    const director = await DIRECTOR.findOne({ club: club });
    if (!director) {
      return res.status(404).json({ message: `Director not found for club: ${club}` });
    }

    // Select club model dynamically
    const ClubModel = clubModels[club];

    if (!ClubModel) {
      return res.status(400).json({ message: `Invalid club type: ${club}` });
    } 

    // Fetch Art Club for given district and club
    const artClub = await ClubModel.findOne({ district });
    if (!artClub) {
      return res.status(403).json({ message: `Art club not found for district: ${district}` });
    }

    const head = artClub.head;
    const council_members = artClub.council;

    // Create new Chapter
    const newChapter = new LOCALEVENT({
      title,
      image,
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