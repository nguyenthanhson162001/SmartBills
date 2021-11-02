const Bill = require('../models/bill')
const { uploadFile, getFileStream } = require('../../config/aws/s3')
const Paginatoin_soft = require('..//..//util/paginationAndSoft')
const limit = 10
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
class billController {
    // [GET] api/bill/getimage:key
    async getImage(req, res) {
        try {
            const { key } = req.params
            const resultImage = await getFileStream(key)
            if (resultImage.length == 0) {
                res.status(500).send()
                return
            }
            resultImage.pipe(res)
        } catch (error) {
            res.status(500).send()
        }
    }
    //[bill] api/bill/store
    async store(req, res) {
        const image = req.file
        // upload to 3S
        if (!image)
            return res.status(400).send('required image')
        const resultUpload = await uploadFile(image)
        unlinkFile(image.path)
        const owner = req.userID
        //          call API use model 
        //--- **************************** ---//
        const bill = new Bill({ owner: owner, imageKey: resultUpload.key })
        res.status(200).json(bill)
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
module.exports = new billController();