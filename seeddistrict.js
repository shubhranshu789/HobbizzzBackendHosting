const mongoose = require("mongoose");
require("./model/DISTRICT"); // adjust path if needed

const District = mongoose.model("DISTRICT"); // ensure this matches your model name
// connect to your MongoDB

const {mongoURl}  = require('./keys');
mongoose.connect(mongoURl);

mongoose.connection.once("open", async () => {
  console.log("MongoDB connected!");

  try {
    
    // Sample district data
    const districts = [
      {
        name: "Varanasi",
        total_members: 100,
        Max_members: 120,
        chapters: 0,
        students: 70,
        teachers: 25,
      },
      {
        name: "Lucknow",
        total_members: 100,
        Max_members: 120,
        chapters: 0,
        students: 70,
        teachers: 25,
      },
      {
        name: "Prayagraj",
        total_members: 100,
        Max_members: 120,
        chapters: 0,
        students: 70,
        teachers: 25,
      },
      {
        name: "Kanpur",
        total_members: 100,
        Max_members: 120,
        chapters: 0,
        students: 70,
        teachers: 25,
      },
    ];

    // Insert sample data
    await District.insertMany(districts);
    console.log("District data inserted successfully.");

  } catch (error) {
    console.error("Error seeding district data:", error);
  } finally {
    mongoose.connection.close();
  }
});
