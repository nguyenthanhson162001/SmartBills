const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema;

const Bill = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    imageKey: String,
    item: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    address: String,
    total: { type: Number, default: 0 },
    datetime: { type: Date, default: Date.now },
}, { timestamps: true })
Bill.plugin(mongoosePaginate);
Bill.plugin(mongoose_delete, {
    // overrideMethods: ['count', 'findOneAndUpdate', 'update'],
    deletedAt: true
});

module.exports = mongoose.model('Bill', Bill)
