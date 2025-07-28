const mongoose = require("mongoose");
require("./AllModels/photographyClubModel/clubs/photoClubs"); // adjust path if needed

const craftClub = mongoose.model("PHOTOCLUB"); // ensure this matches your model name
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
        district: "Gurugram",
        
      },
      {
        district: "Ghaziabad",
        
      },
      {
        district: "Noida",
        
      },
      {
        district: "Gurgaon",
        
      },
      {
        district: "Muradabad",
        
      },
      {
        district: "Meerut",
        
      },
      {
        district: "Gautam Buddha Nagar",
        
      },
      {
        district: "Bulandshahr",
        
      },
      {
        district: "Faridabad",
        
      },
      {
        district: "Agra",
        
      },
      {
        district: "Delhi",
        
      },
    ];

    // Insert sample data
    await craftClub.insertMany(districts);
    console.log("District data inserted successfully.");



  } catch (error) {
    console.error("Error seeding district data:", error);
  } finally {

    const info = await craftClub.find();
    console.log(info);


    mongoose.connection.close();
  }
});
