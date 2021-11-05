const express = require('express');
const router = express.Router()
const billsController = require('../app/controller/BillsController')
const multer = require('multer')
const upload = multer({ dest: 'public/image/bills' })
const verifyMiddleware = require('..//app/middlewarse/verifyToken')
const softMiddleware = require('../app/middlewarse/softMiddlewarse')
router.post('/store', verifyMiddleware, upload.single('image'), billsController.store)
router.get('/bills', softMiddleware, billsController.bills)
// router.get('/getimage/:key', billsController.getImage)

router.get('/', (req, res) => res.render('this is page bill'))
module.exports = router
