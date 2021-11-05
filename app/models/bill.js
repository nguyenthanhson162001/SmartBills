const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema;

const Bill = new Schema({
    imageKey: String,
    BillName: { type: String },
    companyName: { type: String },
    address: { type: String },
    taxCode: { type: String },
    numberBill: { type: String },
    bankAccountsNumber: { type: String },
    totalAmount: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    vatRate: { type: Number, default: 0 },
    totalPayment: { type: Number, default: 0 },
    datetime: { type: Date, default: Date.now },
    buyer: { type: String },
    seller: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    item: [{ type: Schema.Types.ObjectId, ref: 'Item' }],

}, { timestamps: true })
Bill.plugin(mongoosePaginate);
Bill.plugin(mongoose_delete, {
    // overrideMethods: ['count', 'findOneAndUpdate', 'update'],
    deletedAt: true
});

module.exports = mongoose.model('Bill', Bill)
