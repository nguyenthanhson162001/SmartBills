const Bill = require('..//.//models/bill')
const Paginatoin_soft = require('../../util/paginationAndSoft')
const BillValidation = require('..//..//config/validation/billValidation')
const ConvertBill = require('../../util/convertBill')
const Analysis = require('../../util/Analysis')
const StatisticalBill = require("../../util/StatisticalBill")
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

        var items = [
            {
                "name": "Sữa",
                "price": 9000,
                "quantity": 20
            }, {
                "name": "Bia",
                "price": 12000,
                "quantity": 10
            }, {
                "name": "Nước ngọt",
                "price": 10000,
                "quantity": 10
            }
        ]
        var bill2 = new Bill({ imageKey: image.filename, total: 400, dateTime: '2021/10/10', address: 'Dương quản hàm Gò vấp', owner: req.userID, items })
        res.status(200).json({ status: true, bill: ConvertBill.convert(bill2), error: '' })
        return
        try {
            var analysis = await Analysis(fs.readFileSync(`${process.cwd()}/public/images/bills/${image.filename}`))
            var { total, dateTime, address, items } = analysis.data
            var bill = new Bill({ imageKey: image.filename, total, dateTime, address, owner: req.userID, items })
            var totalCacurator = 0;
            bill.items.forEach((e) => {
                totalCacurator += e.price * e.quantity
            })
            if (bill.total < totalCacurator) {
                bill.total = totalCacurator
            }
            bill.save().then(function () {
                res.status(200).json({ status: true, bill: ConvertBill.convert(bill), error: '' })
            }).catch(function (err) {
                res.status(200).json({ status: false, bill: ConvertBill.convert(bill), error: 'server save ' + err })
            })
            return
        } catch (error) {
            console.log(error)
            res.status(200).json({ status: false, bill: new Bill(), error: 'server AI ' + error })
        }
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
                        // console.log('File deleted!');
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
        var { month = new Date().getMonth() + 1, year = new Date().getFullYear(), type = "day" } = req.query
        var id = mongoose.Types.ObjectId(req.userID);
        var sumAll = 0, countAll = 0;

        var result;
        switch (type) {
            case "month":
                result = await StatisticalBill.getMonthStatistical(id, parseInt(year))
                result.forEach(function (e) {
                    sumAll += e.sumTotal
                    countAll += e.count
                })
                console.log(month)
                break;
            case "year":
                result = await StatisticalBill.getYearStatistical(id)
                result.forEach(function (e) {
                    sumAll += e.sumTotal
                    countAll += e.count
                })
                break;
            default:
                result = await await StatisticalBill.getDayStatistical(id, parseInt(month), parseInt(year))
                result.forEach(function (e) {
                    sumAll += e.sumTotal
                    countAll += e.count
                })
        }
        res.json({ sumAll, countAll, details: result })
    }
}


module.exports = new billsController();
