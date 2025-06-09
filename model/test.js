const mongoose = require('mongoose');


const testSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true
    },
   
})



mongoose.model("TEST" ,testSchema )