const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
    volunteerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, ref: 'Volunteer'
    },
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, ref: 'Event'
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