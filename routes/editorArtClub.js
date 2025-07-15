const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")

const {Jwt_secret} = require("../keys");

const CLUBNEWS = mongoose.model("CLUBNEWS");
const CLUBJOURNAL = mongoose.model("CLUBJOURNAL");
const CLUBDOMAIN = mongoose.model("CLUBDOMAIN");
const GALLERY = mongoose.model("GALLERY");
const HERITAGE = mongoose.model("HERITAGE");
const CALENDAR = mongoose.model("CALENDAR");
const LEGACY = mongoose.model("LEGACY");


// const requireLoginUser = require("../middleWares/requireLoginUser");

// POST /api/news — Create news


// ---------------------------------------------------------------clubnews----------------------------------------------------------
router.post('/clubnews', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CLUBNEWS(newsData);
    await newNews.save();

    res.status(201).json({
      success: true,
      message: "News posted successfully!",
      data: newNews,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to post news",
      error: err.message,
    });
  }
});


router.get("/artNews/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CLUBNEWS.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/clubnewsviewallpost', async (req, res) => {
  try {
    const allNews = await CLUBNEWS.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: allNews.length,
      data: allNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});


router.delete('/club-news/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CLUBNEWS.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});

router.put('/club-news-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await CLUBNEWS.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      // runValidators: true, // apply schema validation
    });

    if (!updatedJournal) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json({ message: 'Updated successfully', data: updatedJournal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating', error: error.message });
  }
});

// -------------------------------------------------------------------------------------------------------------------------





// ----------------------------------------------------------clubjournal---------------------------------------------------------------

router.post('/clubjournal', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CLUBJOURNAL(newsData);
    await newNews.save();

    res.status(201).json({
      success: true,
      message: "News posted successfully!",
      data: newNews,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to post news",
      error: err.message,
    });
  }
});

router.get('/clubjpurnalviewallpost', async (req, res) => {
  try {
    const allNews = await CLUBJOURNAL.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: allNews.length,
      data: allNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});


router.get("/artJournal/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CLUBJOURNAL.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/club-journal/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CLUBJOURNAL.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});


router.put('/club-journal-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await CLUBJOURNAL.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      // runValidators: true, // apply schema validation
    });

    if (!updatedJournal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal updated successfully', data: updatedJournal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating journal', error: error.message });
  }
});

// -------------------------------------------------------------------------------------------------------------------------




// ----------------------------------------------------------clubdomain---------------------------------------------------------------

router.post('/clubdomain', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CLUBDOMAIN(newsData);
    await newNews.save();

    res.status(201).json({
      success: true,
      message: "News posted successfully!",
      data: newNews,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to post news",
      error: err.message,
    });
  }
});


router.get('/clubdomainviewallpost', async (req, res) => {
  try {
    const allNews = await CLUBDOMAIN.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: allNews.length,
      data: allNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});


router.get("/artDomain/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CLUBDOMAIN.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/club-domain/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CLUBDOMAIN.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});

router.put('/club-domain-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await CLUBDOMAIN.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      // runValidators: true, // apply schema validation
    });

    if (!updatedJournal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal updated successfully', data: updatedJournal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating journal', error: error.message });
  }
});
// -------------------------------------------------------------------------------------------------------------------------















// -----------------------------------------GALLERY-----------------------------------------------------------


router.post('/gallerypost', async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ error: "Title and imageUrl are required!" });
    }

    const newImage = new GALLERY({ title, imageUrl });
    await newImage.save();

    res.status(201).json({ message: "Image added successfully!", data: newImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  GET: API FOR IMAGE GALLERY
router.get('/viewgallerypost', async (req, res) => {
  try {
    const images = await  GALLERY.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/club-gallery/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await GALLERY.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});


// --------------------------------------------------------------------------------------------------------





// -------------------------------------------------HERITAGE-----------------------------------------------------------


router.post('/heritage', async (req, res) => {
  try {
    const { title, category, origin, imageUrl, description, period, tags } = req.body;

    // Create new document
    const newEntry = new HERITAGE({
      title,
      category,
      origin,
      imageUrl,
      description,
      period,
      tags,
    });

    const saved = await newEntry.save();
    return res.status(201).json({
      success: true,
      message: 'Hall of Fame entry created successfully!',
      data: saved,
    });
  } catch (error) {
    console.error('Error creating Hall of Fame entry:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});


// GET: API FOR HALL OF FAME
router.get('/heritagegetallpost', async (req, res) => {
  try {
    const hallOfFame = await HERITAGE.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: hallOfFame.length,
      data: hallOfFame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});


router.get("/artHeritage/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await HERITAGE.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/club-heritage/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await HERITAGE.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});

router.put('/club-heritage-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await HERITAGE.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      // runValidators: true, // apply schema validation
    });

    if (!updatedJournal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal updated successfully', data: updatedJournal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating journal', error: error.message });
  }
});

// ------------------------------------------------------------------------------------------------------------





// ------------------------------------------------CALENDAR------------------------------------------------------------



router.get('/api/events', async (req, res) => {
  const events = await CALENDAR.find({});
  res.status(200).json(events);
});

router.post('/api/events', async (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !date) {
    return res.status(400).json({ message: 'Missing title or date' });
  }
  const newEvent = await CALENDAR.create({ title, description, date });
  res.status(201).json(newEvent);
});


router.delete('/api/events/by-date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const result = await CALENDAR.deleteMany({ date });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No events found for this date' });
    }
    res.status(200).json({ message: `${result.deletedCount} event(s) deleted` });
  } catch (err) {
    console.error('Delete by date error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ------------------------------------------------------------------------------------------------------------




// ----------------------------------------------------LEGACY-------------------------------------------------------
router.post('/LEGACY', async (req, res) => {
  try {
    const { title, category, origin, imageUrl, description, period, tags } = req.body;

    // Create new document
    const newEntry = new LEGACY({
      title,
      category,
      origin,
      imageUrl,
      description,
      period,
      tags,
    });

    const saved = await newEntry.save();
    return res.status(201).json({
      success: true,
      message: 'Hall of Fame entry created successfully!',
      data: saved,
    });
  } catch (error) {
    console.error('Error creating Hall of Fame entry:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});


// GET: API FOR HALL OF FAME
router.get('/LEGACYgetallpost', async (req, res) => {
  try {
    const hallOfFame = await LEGACY.find().sort({ publishedAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: hallOfFame.length,
      data: hallOfFame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    }); 
  }
});


router.get("/artLEGACY/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await LEGACY.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/club-legacy/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await LEGACY.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});

router.put('/club-legacy-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await LEGACY.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      // runValidators: true, // apply schema validation
    });

    if (!updatedJournal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal updated successfully', data: updatedJournal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating journal', error: error.message });
  }
});

// -----------------------------------------------------------------------------------------------------------





module.exports = router;