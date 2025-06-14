
const express = require('express');
const cors = require('cors');



const port = 5000;
const app = express();


app.use(cors())
require('./model/user')
require('./model/cabinate')
require('./model/addActivity')
require('./model/test')
require('./model/director')
require('./model/clubs/artClubs')




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes/auth'))
app.use(require('./routes/activity'))
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



