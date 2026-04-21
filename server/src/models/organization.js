const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: { // needs to be hashed in the future
        type: String,
        required: true
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
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    categories: {
        type: [String],
        enum: ['community', 'education', 'environment', 'health']
    },
    address: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Organization", organizationSchema);
