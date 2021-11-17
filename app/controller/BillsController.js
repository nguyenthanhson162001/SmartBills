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
        var test = new Bill({
            imageKey: image.filename,
            total: 556000, dateTime: '2021/11/18',
            address: "Số 4 Nguyễn Văn bảo", owner: req.userID,
            items: [{
                name: "Bia",
                price: 12,
                quantity: 24
            }, {
                name: "Sữa",
                price: 7,
                quantity: 9
            }, {
                name: "Nước dừa",
                price: 15,
                quantity: 3
            }, {
                name: "Bò cụng",
                price: 10,
                quantity: 6
            }, {
                name: "Bia hơi",
                price: 20000,
                quantity: 5
            },
            ]
        });
        res.json({ status: true, bill: ConvertBill.convert(test), error: '' })
        var bill;
        return;
        try {
            var analysis = await Analysis(fs.readFileSync(`${process.cwd()}/public/images/bills/${image.filename}`))
            var { total, dateTime, address, items } = await analysis.json();
            bill = new Bill({ imageKey: image.filename, total, dateTime, address, owner: req.userID, items })
        } catch (error) {
            console.log(error)
            res.status(200).json({ status: false, bill: new Bill(), error: 'server AI ' + error })
        }
        if (!bill) {
            return
        }
        var bill2 = new Bill({
            imageKey: image.filename, total: bill.total, dateTime: bill.dateTime,
            address: bill.address, owner: req.userID, items: bill.items
        })
        console.log(bill2)
        var totalCacurator = 0;
        bill.items.forEach((e) => {
            totalCacurator += e.price * e.quantity
        })
        if (bill.total < totalCacurator) {
            bill.total = totalCacurator
        }
        bill2.save().then(function () {
            res.status(200).json({ status: true, bill: ConvertBill.convert(bill), error: '' })
        }).catch(function (err) {
            res.status(200).json({ status: false, bill: ConvertBill.convert(bill), error: 'server save ' + err })
        })
        return
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
    // [GET] api/bill/statistical
    async statistical(req, res) {
        // Tong Doanh thu
        var { month = new Date().getMonth() + 1, year = new Date().getFullYear(), type = "day" } = req.query
        var id = mongoose.Types.ObjectId(req.userID);
        var sumAllTotalBill = 0, countAllBill = 0;
        var result;
        switch (type) {
            case "month":
                result = await StatisticalBill.getMonthStatistical(id, parseInt(year))
                result.forEach(function (e) {
                    sumAllTotalBill += e.sumTotal
                    countAllBill += e.countBill
                })
                break;
            case "year":
                result = await StatisticalBill.getYearStatistical(id)
                result.forEach(function (e) {
                    sumAllTotalBill += e.sumTotal
                    countAllBill += e.countBill
                })
                break;
            default:
                result = await StatisticalBill.getDayStatistical(id, parseInt(month), parseInt(year))
                result.forEach(function (e) {
                    sumAllTotalBill += e.sumTotal
                    countAllBill += e.countBill
                })
        }
        res.json({ sumAllTotalBill, countAllBill, type, details: result })
    }
    // [GET] api/bill/percent-growth-rate-with-month
    async growthRateWithMonth(req, res) {
        var { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query
        var id = mongoose.Types.ObjectId(req.userID);

        res.json(await StatisticalBill.getGrowthRateTotalWithMonth(id, parseInt(month), parseInt(year)))
    }
    // [GET] api/bill/statistical-overview
    async statisticalOverview(req, res) {
        var id = mongoose.Types.ObjectId(req.userID);
        res.json(await StatisticalBill.overview(id))
    }
}


module.exports = new billsController();
