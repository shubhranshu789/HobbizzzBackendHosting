const mongoose = require("mongoose");
require("./model/clubs/artClubs"); // adjust path if needed

const ArtClub = mongoose.model("ARTCLUB"); // ensure this matches your model name
// connect to your MongoDB

const {mongoURl}  = require('./keys');
mongoose.connect(mongoURl);

mongoose.connection.once("open", async () => {
  console.log("MongoDB connected!");

  try {
    
    // Sample district data
    const districts = [
      {
        district: "Varanasi",
        
      },
      {
        district: "Kanpur",
        
      },
      {
        district: "Noida",
        
      },
      {
        district: "Agra",
        
      },
      {
        district: "Ghaziabad",
        
      },
      {
        district: "Prayagraj",
        
      },

      
    ];

    // Insert sample data
    await ArtClub.insertMany(districts);
    console.log("District data inserted successfully.");



  } catch (error) {
    console.error("Error seeding district data:", error);
  } finally {

    const info = await ArtClub.find();
    console.log(info);


    mongoose.connection.close();
  }
});
