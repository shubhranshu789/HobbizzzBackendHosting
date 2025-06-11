const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const droleSchema = new mongoose.Schema({
    appliedBy: { type: ObjectId, ref: "USER",},
    club:      { type: String, required: true },
    interest:  { type: String, required: true },
    school:    { type: String, required: true },
    district:  { type: String, required: true },
    state:     { type: String, required: true },
    role: {
        type: String,
        enum: ['coucil', 'head', 'pending'], // you can define allowed values
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['applied', 'approved', 'rejected'], // you can define allowed values
        default: 'applied'
    }    
});

mongoose.model("DROLE", droleSchema);
