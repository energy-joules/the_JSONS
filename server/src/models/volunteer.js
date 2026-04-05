const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
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
        type: [{ url: URL }]
    },
    address: {
        type: String
    }

});

volunteerSchema.index({ username: 1, password: 1}, { unique: true });

module.exports = mongoose.model("Volunteer", volunteerSchema);