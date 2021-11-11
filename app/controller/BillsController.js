const Bill = require('..//.//models/bill')
const Paginatoin_soft = require('../../util/paginationAndSoft')
const BillValidation = require('..//..//config/validation/billValidation')
const ConvertBill = require('../../util/convertBill')
var mongoose = require('mongoose');

const limit = 10
var fs = require('fs');
const { throws } = require('assert');
class billsController {
    //[POST] api/bill/store
    async store(req, res) {
        const image = req.file
        if (!image)
            return res.status(400).send('required image')

        var { total, dateTime, address, items } = req.body
        items = [
            {
                name: "Sữa",
                price: 9000,
                quantity: 20
            }
        ]
        var bill = new Bill({ imageKey: image.filename, total, dateTime, address, owner: req.userID, items })
        console.log(bill)
        bill.save().then(function () {
            res.status(200).json({ status: true, bill: ConvertBill.convert(bill) })
        }).catch(function (err) {
            res.status(200).json({ status: false, bill: ConvertBill.convert(bill) })
        })
    }
    // [GET] api/bill/bills
    async bills(req, res) {
        let { option, params, page } = Paginatoin_soft.paginatoin_soft(req, res, limit)
        Bill.paginate({ deleted: false }, option)
            .then((bills) => {
                // console.log(ConvertBill.converts(bills))
                res.status(200).json({ bills: ConvertBill.convertPagintions(bills) })
            })
            .catch((err) => {
                res.status(500).send('server error' + err)
            })
    }
    // [GET] api/bill/mybill
    async myBills(req, res) {
        let { option, params, page } = Paginatoin_soft.paginatoin_soft(req, res, limit)
        Bill.paginate({ deleted: false, owner: req.userID }, option)
            .then((bills) => {
                res.status(200).json({ bills })
            })
            .catch((err) => {
                res.status(500).send('server error')
            })
    }
    // [PUT] api/bill/edit:id
    edit(req, res) {
        var { total, dateTime, address, items } = req.body
        var { error } = BillValidation.billValidation({ total, dateTime, address })
        if (items == undefined) {
            items = []
        }
        if (error) {
            res.status(200).json({ status: false, error: "Update false " + error })
            return;
        }
        // console.log({ _id: req.sparams.id, owner: req.userID })
        Bill.findOne({ _id: req.params.id, owner: req.userID }).then(function (billOld) {
            if (!billOld) {
                throw 'Id bill not exist'
            }
            // console.log({ total, datetime, address, item })
            return Bill.updateOne({ _id: req.params.id }, { total, dateTime, address, items })
        })
            .then(() => {
                res.status(200).json({ status: true, error: "" })
            })
            .catch((err) => {
                res.status(200).json({ status: false, error: "Update false " + err })
            })
    }
    // [DELETE] api/bill/delete:id
    async delete(req, res) {
        var id = req.params.id
        Bill.findOne({ _id: req.params.id, owner: req.userID }).then(function (billOld) {
            if (!billOld) {
                res.status(200).json({ status: false, error: "Delete false bill not exist" })
                return
            }
            Bill.deleteOne({ _id: id, owner: req.userID })
                .then(() => {
                    res.status(200).json({ status: true, error: "" })
                    fs.unlink(`${process.cwd()}/public/images/bills/${billOld.imageKey}`, function (err) {
                        if (err) throw err;
                        console.log('File deleted!');
                        console.log(`${process.cwd()}/public/images/bills/${billOld.imageKey}`)
                    });

                }).catch(err => {
                    console.log(err)
                    res.status(400).json({ status: false, error: "delete false " + err })
                })
        })
            .catch((err) => {
                res.status(200).json({ status: false, error: "delete false bill not exist" })
            })
    }
    // [DELETE] api/bill/delete:id
    async statistical(req, res) {
        // Tong Doanh thu
        var { month, year } = req.query
        if (month == undefined)
            month = new Date().getMonth() + 1
        if (year == undefined)
            year = new Date().getFullYear()
        var id = mongoose.Types.ObjectId(req.userID);
        console.log(month)
        console.log(id)
        // 
        var monthStatistical = await Bill.aggregate([
            { $match: { owner: id } },
            {
                $match: {
                    $and: [
                        { $expr: { $eq: [{ $month: '$createdAt' }, month] } },
                        { $expr: { $eq: [{ $year: '$createdAt' }, year] } }]
                }
            }, {
                $group: {
                    _id: { $dayOfMonth: '$createdAt' },
                    sum: { $sum: '$total' }, count: { $sum: 1 }
                }
            }, {
                $sort: { _id: 1 }
            },
            {
                $project: { _id: 0, day: '$_id', sum: 1, count: 1 }
            }])


        res.json({ monthStatistical })
        // if (monthStatistical.length == 0) {

        //     res.json({ count: 0, sum: 0, avg: 0 })
        //     return
        // }

        // var { count, sum } = billSum[0]
        // var avg = parseFloat(sum / count).toFixed(2)

    }
}
module.exports = new billsController();
