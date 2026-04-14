const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    password: { // needs to be hashed in the future
        type: String, 
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    certificates: {
        type: [{ url: String }]
    },
    address: {
        type: String
    }

});

module.exports = mongoose.model("Volunteer", volunteerSchema);