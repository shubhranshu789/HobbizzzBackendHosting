
const express = require('express');
const cors = require('cors');



const port = 5000;
const app = express();


app.use(cors())
require('./model/user')
require('./model/cabinate')
require('./model/addActivity')
require('./model/test')
<<<<<<< HEAD
require('./model/DISTRICT');
require('./model/apply-role');
=======
require('./model/director')
require('./model/clubs/artClubs')
>>>>>>> 0feb76913e99939eed124d7daa62f8b2d01d351d




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes/auth'))
app.use(require('./routes/activity'))

app.use(require('./routes/role'))

app.use(require('./routes/user'))
app.use(require('./routes/artclub'))




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



