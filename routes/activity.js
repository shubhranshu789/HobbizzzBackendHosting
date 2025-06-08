const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const requireLogin = require("../middleWares/requireLogin");

const CABINATE = mongoose.model("CABINATE");
const ACTIVITY = mongoose.model("ACTIVITY");


router.post("/create-activity", requireLogin, (req, res) => {
  const { title , desc,pic , category} = req.body;

  if (!title || !desc || !pic || !category) {
    console.log(category, title, desc , pic);
    return res.status(422).json({ error: "Please add all the fields" });
  }

  const event = new ACTIVITY({
    title,
    category,
    desc,
    pic,
    postedBy: req.user,
  });

  event
    .save()
    .then((result) => {
      return res.json({ event: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to create the post" });
    });
});


module.exports = router;
