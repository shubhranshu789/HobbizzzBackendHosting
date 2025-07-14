
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
require('./AllModels/craftClubModel/craft-apply-role')
require('./AllModels/craftClubModel/craftdistrict')


// ----------------------------------------------------------------------------------------------






app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes/auth'))
app.use(require('./routes/activity'))
app.use(require('./routes/chapter'))
app.use(require('./routes/school'))
app.use(require('./routes/user'))
app.use(require('./routes/artclub'))
app.use(require('./routes/compitition'))
app.use(require('./routes/editorArtClub'))






// -----------------------------------------CraftClubRoute-----------------------------------------------------
app.use(require('./routes/AllClubRoutes/CraftClub/auth'))
app.use(require('./routes/AllClubRoutes/CraftClub/activity'))
app.use(require('./routes/AllClubRoutes/CraftClub/chapter'))
app.use(require('./routes/AllClubRoutes/CraftClub/club'))
app.use(require('./routes/AllClubRoutes/CraftClub/compitition'))
app.use(require('./routes/AllClubRoutes/CraftClub/editor'))
app.use(require('./routes/AllClubRoutes/CraftClub/role'))
app.use(require('./routes/AllClubRoutes/CraftClub/role'))

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



