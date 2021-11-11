const Bill = require('..//.//models/bill')
const Paginatoin_soft = require('../../util/paginationAndSoft')
const BillValidation = require('..//..//config/validation/billValidation')
const ConvertBill = require('../../util/convertBill')
var fetch = require("fetch");
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

        var { total, dateTime, address, items } = req.body
        items = [
            {
                name: "Bia",
                price: 10000,
                quantity: 10
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
        var { month = new Date().getMonth() + 1, year = new Date().getFullYear(), type = "day" } = req.query
        var id = mongoose.Types.ObjectId(req.userID);
        var sumAll = 0, countAll = 0;

        var result;
        console.log(type)
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

function send() {
    const fileInput = document.querySelector('#your-file-input');
    const formData = new FormData();

    formData.append('image', fileInput.files[0]);
    console.log(formData)

    fetch('http://localhost:3001/api/bill/store', {
        method: 'POST',
        headers: {

            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTgyZTI3OGRhOTMyMzM3MTE3Y2EyMTYiLCJpYXQiOjE2MzY2MTQ2NDEsImV4cCI6MTYzNjYyOTA0MX0.2dvXIXetEfkEJ3BaORcEJV6q3q22WX9KhDwrCREAuHY'
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('result').innerHTML = ` Ok  `;
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = error;
        });
}
module.exports = new billsController();
