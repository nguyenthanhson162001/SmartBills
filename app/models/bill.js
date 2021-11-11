const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema;

const Bill = new Schema({
    imageKey: String,
    total: { type: Number, default: 1 },
    dateTime: { type: String, default: "" },
    address: { type: String, maxLength: 255, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            _id: false,
            name: { type: String, maxLength: 255, default: "" },
            price: { type: Number, default: 1 },
            quantity: { type: Number, default: 1 },
        }
    ],

}, { timestamps: true })
Bill.plugin(mongoosePaginate);
Bill.plugin(mongoose_delete, {
    // overrideMethods: ['count', 'findOneAndUpdate', 'update'],
    deletedAt: true
});



module.exports = mongoose.model('Bill', Bill)
