const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema;

const Bill = new Schema({
    imageKey: String,
    BillName: { type: String, maxLength: 255, default: "" },
    companyName: { type: String, maxLength: 255, default: "" },
    address: { type: String, maxLength: 255, default: "" },
    taxCode: { type: String, maxLength: 255, default: "" },
    numberBill: { type: String, maxLength: 255, default: "" },
    bankAccountsNumber: { type: String, maxLength: 255, default: "" },
    totalAmount: { type: Number, default: -1 },
    vatAmount: { type: Number, default: -1 },
    vatRate: { type: Number, default: -1 },
    totalPayment: { type: Number, default: -1 },
    moneyReceived: { type: Number, default: -1 },
    datetime: { type: Date, default: Date.now },
    buyer: { type: String, maxLength: 255, default: "" },
    seller: { type: String, maxLength: 255, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    item: [
        {
            name: { type: String, maxLength: 255, default: "" },
            price: { type: Number, default: -1 },
            quantity: { type: Number, default: -1 },
            unit: { type: String, default: "" }
        }
    ],

}, { timestamps: true })
Bill.plugin(mongoosePaginate);
Bill.plugin(mongoose_delete, {
    // overrideMethods: ['count', 'findOneAndUpdate', 'update'],
    deletedAt: true
});



module.exports = mongoose.model('Bill', Bill)
