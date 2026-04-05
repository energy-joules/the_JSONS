const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    organizationID: {
        type: ObjectId,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }

});

module.exports = mongoose.model("Event", eventSchema);