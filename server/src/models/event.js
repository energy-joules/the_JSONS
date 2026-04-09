const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
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