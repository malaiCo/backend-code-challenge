const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const neoSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    reference: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    speed: String,
    is_hazardous: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Neo', neoSchema);