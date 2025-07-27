
const express = require('express');
const cors = require('cors');



const port = 5000;
const app = express();


app.use(cors())

// --------------------------------------------ArtClub--------------------------------------------------

require('./AllModels/artClubModel/user')
require('./AllModels/artClubModel/cabinate')
require('./AllModels/artClubModel/addActivity')
require('./AllModels/artClubModel/localEvent')
require('./AllModels/artClubModel/director')
require('./AllModels/artClubModel/school')
require('./AllModels/artClubModel/addCompitition')
require('./AllModels/artClubModel/calender')
require('./AllModels/artClubModel/judge')
require('./AllModels/artClubModel/principle')
require('./AllModels/artClubModel/editor')
require('./AllModels/artClubModel/clubs/artClubs')
require('./AllModels/artClubModel/EditorArtClub/journal')
require('./AllModels/artClubModel/EditorArtClub/clubNews')
require('./AllModels/artClubModel/EditorArtClub/clubDomain')
require('./AllModels/artClubModel/EditorArtClub/clubGallery')
require('./AllModels/artClubModel/EditorArtClub/clubHeritage')
require('./AllModels/artClubModel/EditorArtClub/clublegacy')


// ----------------------------------------------------------------------------------------------



// -----------------------------------------craftClubModel-----------------------------------------------------
require('./AllModels/craftClubModel/clubs/craftClubs')
require('./AllModels/craftClubModel/craftdirector')
require('./AllModels/craftClubModel/craftcalendar')
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
require('./AllModels/techClubModel/techcabinate')
require('./AllModels/techClubModel/techcalendar')
require('./AllModels/techClubModel/techdirector')
require('./AllModels/techClubModel/techeditor')
require('./AllModels/techClubModel/techjudge')
require('./AllModels/techClubModel/techprinciple')
require('./AllModels/techClubModel/techuser')
require('./AllModels/techClubModel/EditorTechClub/techaddActivity')
require('./AllModels/techClubModel/EditorTechClub/techaddCompitition')

require('./AllModels/techClubModel/techschool.js')
require('./AllModels/techClubModel/localevents')

require('./AllModels/techClubModel/EditorTechClub/techClubDomain')
require('./AllModels/techClubModel/EditorTechClub/techClubGallery')
require('./AllModels/techClubModel/EditorTechClub/techClubHeritage')
require('./AllModels/techClubModel/EditorTechClub/techClubNews')
require('./AllModels/techClubModel/EditorTechClub/techClublegacy')
require('./AllModels/techClubModel/EditorTechClub/techJournal')


//-------------------------------------------------------------------------------------------------------------------------




//----------------------------------------------------------photoClubModel-----------------------------------------------
require('./AllModels/photographyClubModel/clubs/photoClubs.js')
require('./AllModels/photographyClubModel/addActivity')
require('./AllModels/photographyClubModel/addCompitition')
require('./AllModels/photographyClubModel/photocabinate')
require('./AllModels/photographyClubModel/photodirector')
require('./AllModels/photographyClubModel/photodistrict')
require('./AllModels/photographyClubModel/photoeditor')
require('./AllModels/photographyClubModel/photojudge')
require('./AllModels/photographyClubModel/photoprinciple')
require('./AllModels/photographyClubModel/photouser')



require('./AllModels/photographyClubModel/EditorArtClub/clubDomain.js')
require('./AllModels/photographyClubModel/EditorArtClub/clubGallery.js')
require('./AllModels/photographyClubModel/EditorArtClub/clubHeritage.js')
require('./AllModels/photographyClubModel/EditorArtClub/clubNews.js')
require('./AllModels/photographyClubModel/EditorArtClub/clublegacy.js')
require('./AllModels/photographyClubModel/EditorArtClub/journal.js')






//-------------------------------------------------------------------------------------------------------------------------















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
app.use(require('./routes/AllClubRoutes/TechClub/editorPhotoClub.js'))
app.use(require('./routes/AllClubRoutes/TechClub/school'))



// ----------------------------------------------------------------------------------------------



//---------------------------------------------PhotoClubRoute-----------------------------------------------------

app.use(require('./routes/AllClubRoutes/PhotoClub/activity.js'))
app.use(require('./routes/AllClubRoutes/PhotoClub/auth.js'))
app.use(require('./routes/AllClubRoutes/PhotoClub/club.js'))
app.use(require('./routes/AllClubRoutes/PhotoClub/compitition.js'))
app.use(require('./routes/AllClubRoutes/PhotoClub/editorPhotoClub.js'))




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



