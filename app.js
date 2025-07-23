
const express = require('express');
const cors = require('cors');



const port = 5000;
const app = express();


app.use(cors())

// --------------------------------------------ArtClub--------------------------------------------------

require('./model/user')
require('./model/cabinate')
require('./model/addActivity')
require('./model/test')
require('./model/localEvent')
require('./model/director')
require('./model/clubs/artClubs')
require('./model/school')
// require('./model/clubs/approvedMember')
require('./model/addCompitition')
require('./model/calender')
require('./model/judge')
require('./model/principle')



require('./model/editor')
require('./model/EditorArtClub/journal')
require('./model/EditorArtClub/clubNews')
require('./model/EditorArtClub/clubDomain')
require('./model/EditorArtClub/clubGallery')
require('./model/EditorArtClub/clubHeritage')
require('./model/EditorArtClub/clublegacy')


// ----------------------------------------------------------------------------------------------



// -----------------------------------------craftClubModel-----------------------------------------------------
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
require('./AllModels/craftClubModel/clubs/craftClubs')


require('./AllModels/craftClubModel/EditorCraftClub/craftClubDomain')
require('./AllModels/craftClubModel/EditorCraftClub/craftClubGallery')
require('./AllModels/craftClubModel/EditorCraftClub/craftClubHeritage')
require('./AllModels/craftClubModel/EditorCraftClub/craftClubNews')
require('./AllModels/craftClubModel/EditorCraftClub/craftClublegacy')
require('./AllModels/craftClubModel/EditorCraftClub/craftCournal')

// ----------------------------------------------------------------------------------------------




















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



