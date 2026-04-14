const mongoose = require('mongoose')

const organizationSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
        trim: true,
    },
    password: { // needs to be hashed in the future
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    categories: {
        type: [String]
    },
    address: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model("Organization", organizationSchema);