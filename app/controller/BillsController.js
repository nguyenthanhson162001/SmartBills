const Bill = require('..//.//models/bill')
const Paginatoin_soft = require('../../util/paginationAndSoft')
const limit = 10
var fs = require('fs');
const { throws } = require('assert');
class billsController {
    //[POST] api/bill/store
    async store(req, res) {
        const image = req.file
        const { BillName,
            companyName,
            address,
            taxCode,
            numberBill,
            bankAccountsNumber,
            totalAmount,
            vatAmount,
            vatRate,
            totalPayment,
            datetime,
            buyer,
            seller,
            item, } = req.body

        if (!image)
            return res.status(400).send('required image')
        var bill = new Bill({
            imageKey: image.filename,
            BillName,
            companyName,
            address,
            taxCode,
            numberBill,
            bankAccountsNumber,
            totalAmount,
            vatAmount,
            vatRate,
            totalPayment,
            datetime,
            buyer,
            seller,
            owner: req.userID,
            item,
        }).save().then(function () {
            res.status(200).json({ status: true, error: "" })
        }).catch(function (err) {
            res.status(200).json({ status: false, error: err })
        })

    }
    // [GET] api/bill/bills
    async bills(req, res) {
        let { option, params, page } = Paginatoin_soft.paginatoin_soft(req, res, limit)
        Bill.paginate({ deleted: false }, option)
            .then((bill) => {
                res.status(200).json(bill)
            })
            .catch((err) => {
                res.status(500).send('server error')
            })
    }
    // [GET] api/bill/mybill
    async myBills(req, res) {
        let { option, params, page } = Paginatoin_soft.paginatoin_soft(req, res, limit)
        console.log(req.userID)
        Bill.paginate({ deleted: false, owner: req.userID }, option)
            .then((bill) => {
                res.status(200).json(bill)
            })
            .catch((err) => {
                res.status(500).send('server error')
            })
    }
    // [PUT] api/bill/edit:id
    edit(req, res) {
        const { BillName,
            companyName,
            address,
            taxCode,
            numberBill,
            bankAccountsNumber,
            totalAmount,
            vatAmount,
            vatRate,
            totalPayment,
            datetime,
            buyer,
            seller,
            item, } = req.body
        var bill = new Bill({
            BillName,
            companyName,
            address,
            taxCode,
            numberBill,
            bankAccountsNumber,
            totalAmount,
            vatAmount,
            vatRate,
            totalPayment,
            datetime,
            buyer,
            seller,
            item,
        })

        // console.log({ _id: req.sparams.id, owner: req.userID })
        Bill.findOne({ _id: req.params.id, owner: req.userID }).then(function (billOld) {
            if (!billOld) {
                throw 'Id bill not exist'
            }
            console.log(JSON.stringify(bill))
            return Bill.updateOne({ _id: req.params.id }, JSON.stringify(bill))
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
}
module.exports = new billsController();