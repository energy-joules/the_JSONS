const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Organization'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    maxPeople: {
        type: Number,
        min: 1
    },
    currentPeople: {
        type: Number,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    }

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
