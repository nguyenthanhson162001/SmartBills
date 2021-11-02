const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Item = new Schema({
    name: String,
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 }
})

module.exports = mongoose.model('Item', Item)
