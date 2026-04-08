const mongoose = require('mongoose')

const organizationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
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
        required: true
    },
    categories: {
        type: [String]
    },
    address: {
        type: String
    },
    verified: {
        type: Boolean.apply,
        required: true
    }

});

organizationSchema.index({ username: 1, password: 1}, { unique: true });

module.exports = mongoose.model("Organization", organizationSchema);