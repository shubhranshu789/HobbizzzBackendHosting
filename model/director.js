const mongoose = require('mongoose');


<<<<<<< HEAD:model/district.js
const districtSchema = new mongoose.Schema({
    name : { type:String, require:true} ,
    total_members:{ type: Number, default: 0 },
    Max_members:{
        type: Number,
        default: 1
=======
const directorSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true
>>>>>>> 0feb76913e99939eed124d7daa62f8b2d01d351d:model/director.js
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



<<<<<<< HEAD:model/district.js
module.exports=mongoose.model("DISTRICT" ,districtSchema );
=======
mongoose.model("DIRECTOR" ,directorSchema )
>>>>>>> 0feb76913e99939eed124d7daa62f8b2d01d351d:model/director.js
