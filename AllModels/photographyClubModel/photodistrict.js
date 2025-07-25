const mongoose = require('mongoose');



const districtSchema = new mongoose.Schema({
    name : { type:String, require:true} ,
    total_members:{ type: Number, default: 0 },
    Max_members:{
        type: Number,
        default: 1
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

module.exports=mongoose.model("PHOTODISTRICT" ,districtSchema );
