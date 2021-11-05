const Bill = require('..//.//models/bill')
const Paginatoin_soft = require('../../util/paginationAndSoft')
const limit = 10
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
        })
        Bill.findOne({ _id: req.params.id }).then(function (billOld) {
            if (!billOld) {
                res.status(200).json({ status: true, error: "Update false" + err })
                return
            }
            Bill.replaceOne({}, bill)
                .then(() => {
                    res.status(200).json({ status: true, error: "" })
                })
                .catch((err) => {
                    res.status(200).json({ status: true, error: "Update false" + err })
                })
        }).catch((err) => {
            res.status(200).json({ status: true, error: "Update false" + err })
        })

    }
    // [DELETE] api/bill/delete:id
    async delete(req, res) {
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
}
module.exports = new billsController();