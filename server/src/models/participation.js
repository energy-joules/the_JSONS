const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
    volunteerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Volunteer'
    },
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    },
    hoursEarned: {
        type: Number,
        required: true,
        min: 0
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

}, { timestamps: true });

module.exports = mongoose.model("Participation", participationSchema);
