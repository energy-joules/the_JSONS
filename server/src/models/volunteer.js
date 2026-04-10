const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: { // needs to be hashed in the future
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
    },
    phone: {
        type: String,
        trim: true
    },
    certificates: [
        {
            url: {
                type: String,
                match: [/^https?:\/\/.+/, 'Invalid URL']
            }
        }
    ],
    address: {
        type: String
    }

}, { timestamps: true });

volunteerSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model("Volunteer", volunteerSchema);
