
const express = require('express');
const cors = require('cors');



const port = 5000;
const app = express();


app.use(cors())

// --------------------------------------------ArtClub--------------------------------------------------

require('.AllModels/artClubModel/clubs/artClubs')
require('.AllModels/artClubModel/user')
require('.AllModels/artClubModel/cabinate')
require('.AllModels/artClubModel/addActivity')
require('.AllModels/artClubModel/localEvent')
require('.AllModels/artClubModel/director')
require('.AllModels/artClubModel/school')
require('.AllModels/artClubModel/addCompitition')
require('.AllModels/artClubModel/calender')
require('.AllModels/artClubModel/judge')
require('.AllModels/artClubModel/principle')
require('.AllModels/artClubModel/editor')
require('.AllModels/artClubModel/EditorArtClub/journal')
require('.AllModels/artClubModel/EditorArtClub/clubNews')
require('.AllModels/artClubModel/EditorArtClub/clubDomain')
require('.AllModels/artClubModel/EditorArtClub/clubGallery')
require('.AllModels/artClubModel/EditorArtClub/clubHeritage')
require('.AllModels/artClubModel/EditorArtClub/clublegacy')


// ----------------------------------------------------------------------------------------------



// -----------------------------------------craftClubModel-----------------------------------------------------
require('./AllModels/craftClubModel/clubs/craftClubs')
require('./AllModels/craftClubModel/craftdirector')
require('./AllModels/craftClubModel/crafteditor')
require('./AllModels/craftClubModel/craftjudge')
require('./AllModels/craftClubModel/craftprinciple')
require('./AllModels/craftClubModel/craftuser')
require('./AllModels/craftClubModel/craftcabinate')
require('./AllModels/craftClubModel/craftaddActivity')
require('./AllModels/craftClubModel/craftaddCompitition')
require('./AllModels/craftClubModel/craftschool')
require('./AllModels/craftClubModel/localevents')
require('./AllModels/craftClubModel/EditorCraftClub/craftClubDomain')
require('./AllModels/craftClubModel/EditorCraftClub/craftClubGallery')
require('./AllModels/craftClubModel/EditorCraftClub/craftClubHeritage')
require('./AllModels/craftClubModel/EditorCraftClub/craftClubNews')
require('./AllModels/craftClubModel/EditorCraftClub/craftClublegacy')
require('./AllModels/craftClubModel/EditorCraftClub/craftCournal')

// ----------------------------------------------------------------------------------------------

//----------------------------------------------------------techClubModel-------------------------------------


require('./AllModels/techClubModel/clubs/techClubs')
require('./AllModels/techClubModel/techCabinate')
require('./AllModels/techClubModel/techDirector')
require('./AllModels/techClubModel/techEditor')
require('./AllModels/techClubModel/techJudge')
require('./AllModels/techClubModel/techPrinciple')
require('./AllModels/techClubModel/techUser')
require('./AllModels/techClubModel/techschool.js')
require('./AllModels/techClubModel/localevents')
require('./AllModels/techClubModel/EditorTechClub/techaddActivity')
require('./AllModels/techClubModel/EditorTechClub/techaddCompitition')
require('./AllModels/techClubModel/EditorTechClub/techClubDomain')
require('./AllModels/techClubModel/EditorTechClub/techClubGallery')
require('./AllModels/techClubModel/EditorTechClub/techClubHeritage')
require('./AllModels/techClubModel/EditorTechClub/techClubNews')
require('./AllModels/techClubModel/EditorTechClub/techClublegacy')
require('./AllModels/techClubModel/EditorTechClub/techJournal')









app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes/AllClubRoutes/ArtClub/auth'))
app.use(require('./routes/AllClubRoutes/ArtClub/activity'))
app.use(require('./routes/AllClubRoutes/ArtClub/school'))
app.use(require('./routes/AllClubRoutes/ArtClub/user'))
app.use(require('./routes/AllClubRoutes/ArtClub/artclub'))
app.use(require('./routes/AllClubRoutes/ArtClub/compitition'))
app.use(require('./routes/AllClubRoutes/ArtClub/editorArtClub'))


app.use(require('./routes/chapter'))




// -----------------------------------------CraftClubRoute-----------------------------------------------------
app.use(require('./routes/AllClubRoutes/CraftClub/auth'))
app.use(require('./routes/AllClubRoutes/CraftClub/activity'))
app.use(require('./routes/AllClubRoutes/CraftClub/club'))
app.use(require('./routes/AllClubRoutes/CraftClub/compitition'))
app.use(require('./routes/AllClubRoutes/CraftClub/editor'))
app.use(require('./routes/AllClubRoutes/CraftClub/editorCraftClub'))
app.use(require('./routes/AllClubRoutes/CraftClub/school'))



//---------------------------------------------TechClubRoute-----------------------------------------------------

app.use(require('./routes/AllClubRoutes/TechClub/auth'))
app.use(require('./routes/AllClubRoutes/TechClub/activity'))
app.use(require('./routes/AllClubRoutes/TechClub/club'))
app.use(require('./routes/AllClubRoutes/TechClub/compitition'))
app.use(require('./routes/AllClubRoutes/TechClub/editor'))
app.use(require('./routes/AllClubRoutes/TechClub/school'))



// ----------------------------------------------------------------------------------------------



app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})



const mongoose = require('mongoose');
const {mongoURl}  = require('./keys');


mongoose.connect(mongoURl)


mongoose.connection.on("connected" , () => {
    console.log("Mongoose is connected");
})

mongoose.connection.on("error" , () => {
    console.log("Mongoose is not connected");
})



