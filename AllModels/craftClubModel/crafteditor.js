const mongoose = require('mongoose');


const craftdirectorSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    email:{
        type: String,
        require:true
    },
    club:{
        type: String,
        require:true
    },
    password:{
        type: String,
        require:true
    },
    clubName: {
        type: String,
        required: true
    },
    //add IP
    ip:{
        type: String,
        require:true
    }
})



mongoose.model("CRAFTEDITOR" ,craftdirectorSchema )
