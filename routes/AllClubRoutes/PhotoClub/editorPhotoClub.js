const express = require("express");
const mongoose = require("mongoose");
const router = express.Router()

const CRAFTCLUBNEWS = mongoose.model("PHOTOCLUBNEWS");
const CRAFTCLUBJOURNAL = mongoose.model("PHOTOCLUBJOURNAL");
const CRAFTCLUBDOMAIN = mongoose.model("PHOTOCLUBDOMAIN");
const CRAFTGALLERY = mongoose.model("PHOTOGALLERY");
const CRAFTHERITAGE = mongoose.model("PHOTOHERITAGE");
const CALENDAR = mongoose.model("CALENDAR");
const CRAFTLEGACY = mongoose.model("PHOTOLEGACY");


// const requireLoginUser = require("../middleWares/requireLoginUser");

// POST /api/news — Create news


// ---------------------------------------------------------------clubnews----------------------------------------------------------


router.post('/photoclubnews', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CRAFTCLUBNEWS(newsData);
    await newNews.save();

    res.status(201).json({
      success: true,
      message: "News posted successfully!",
      data: newNews,
    });
  } catch (err) {
    console.error("Error posting news:", err);
    res.status(400).json({
      success: false,
      message: "Failed to post news",
      error: err.message,
    });
  }
});






router.get("/photoartNews/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CRAFTCLUBNEWS.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/photoclubnewsviewallpost', async (req, res) => {
  try {
    const allNews = await CRAFTCLUBNEWS.find().sort({ publishedAt: -1 }); // Latest first
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


router.delete('/photoclub-news/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CRAFTCLUBNEWS.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});

router.put('/photoclub-news-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await CRAFTCLUBNEWS.findByIdAndUpdate(id, updateData, {
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

router.post('/photoclubjournal', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CRAFTCLUBJOURNAL(newsData);
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

router.get('/photoclubjpurnalviewallpost', async (req, res) => {
  try {
    const allNews = await CRAFTCLUBJOURNAL.find().sort({ publishedAt: -1 }); // Latest first
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


router.get("/photoJournal/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CRAFTCLUBJOURNAL.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/photoclub-journal/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CRAFTCLUBJOURNAL.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});


router.put('/photoclub-journal-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await CRAFTCLUBJOURNAL.findByIdAndUpdate(id, updateData, {
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

router.post('/photoclubdomain', async (req, res) => {
  try {
    const newsData = req.body;

    const newNews = new CRAFTCLUBDOMAIN(newsData);
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


router.get('/photoclubdomainviewallpost', async (req, res) => {
  try {
    const allNews = await CRAFTCLUBDOMAIN.find().sort({ publishedAt: -1 }); // Latest first
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


router.get("/photoDomain/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CRAFTCLUBDOMAIN.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/photoclub-domain/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CRAFTCLUBDOMAIN.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});

router.put('/photoclub-domain-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await CRAFTCLUBDOMAIN.findByIdAndUpdate(id, updateData, {
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


router.post('/photogallerypost', async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ error: "Title and imageUrl are required!" });
    }

    const newImage = new CRAFTGALLERY({ title, imageUrl });
    await newImage.save();

    res.status(201).json({ message: "Image added successfully!", data: newImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  GET: API FOR IMAGE GALLERY
router.get('/photoviewgallerypost', async (req, res) => {
  try {
    const images = await  CRAFTGALLERY.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/photoclub-gallery/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CRAFTGALLERY.findByIdAndDelete(id);

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


router.post('/photoheritage', async (req, res) => {
  try {
    const { title, category, origin, imageUrl, description, period, tags } = req.body;

    // Create new document
    const newEntry = new CRAFTHERITAGE({
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
router.get('/photoheritagegetallpost', async (req, res) => {
  try {
    const hallOfFame = await CRAFTHERITAGE.find().sort({ publishedAt: -1 }); // Latest first
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


router.get("/photoHeritage/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CRAFTHERITAGE.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/photoclub-heritage/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CRAFTHERITAGE.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});

router.put('/photoclub-heritage-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await CRAFTHERITAGE.findByIdAndUpdate(id, updateData, {
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
router.post('/photoLEGACY', async (req, res) => {
  try {
    const { title, category, origin, imageUrl, description, period, tags } = req.body;

    // Create new document
    const newEntry = new CRAFTLEGACY({
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
router.get('/photoLEGACYgetallpost', async (req, res) => {
  try {
    const hallOfFame = await CRAFTLEGACY.find().sort({ publishedAt: -1 }); // Latest first
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


router.get("/photoLEGACY/:id", async (req, res) => {
  try {
    const journalId = req.params.id;

    const journal = await CRAFTLEGACY.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/photoclub-legacy/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoc = await CRAFTLEGACY.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ message: 'Journal deleted successfully', data: deletedDoc });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal', error: error.message });
  }
});

router.put('/photoclub-legacy-update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJournal = await CRAFTLEGACY.findByIdAndUpdate(id, updateData, {
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