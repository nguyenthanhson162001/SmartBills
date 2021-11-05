const Bill = require('..//.//models/bill')
const Paginatoin_soft = require('../../util/paginationAndSoft')
class billsController {
    //[bill] api/bill/store
    async store(req, res) {
        const image = req.file
        // upload to 3S
        if (!image)
            return res.status(400).send('required image')
        console.log(image)
        res.send("save successfully")
        var bill = new Bill({
            imageKey: image.filename,
            BillName: "",
            companyName: "",
            address: "",
            taxCode: "",
            numberBill: "",
            bankAccountsNumber: "",
            totalAmount: "",
            vatAmount: "",
            vatRate: "",
            totalPayment: "",
            datetime: "",
            buyer: "",
            seller: "",
            owner: "",
            item: "",
        })
        return
        bill.save()
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
    // [GET] api/me/mybill
    async myBills(req, res) {
        let { option, params, page } = Paginatoin_soft.paginatoin_soft(req, res, limit)
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