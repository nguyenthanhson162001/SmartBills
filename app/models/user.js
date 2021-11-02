const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    lastName: { type: String, required: true, max: 255 },
    firstName: { type: String, required: true, max: 255 },
    provider: { type: String },
    email: { type: String, required: true, max: 255, min: 6 },
    password: { type: String, required: true, max: 255, min: 6 },
}, { timestamps: true })
module.exports = mongoose.model('User', User)