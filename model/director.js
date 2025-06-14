const mongoose = require('mongoose');


const directorSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    chapters: {
        type:Number,
        default: 0
    },
    students: {
        type: Number,
        default: 0
    },
    teachers: {
        type: Number,
        default: 0
    },
    //add IP
    ip:{
        type: String,
        require:true
    }
})



mongoose.model("DIRECTOR" ,directorSchema )
