const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
    volunteerID: {
        type: ObjectId,
        required: true,
        unique: true
    },
    eventID: {
        type: ObjectId,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true
    },
    hoursEarned: {
        type: Number,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    departureTime: {
        type: Date
    },
    awaitingConfirmation: {
        type: Boolean,
        required: true
    }

});

module.exports = mongoose.model("Participation", participationSchema);