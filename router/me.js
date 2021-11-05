const express = require('express');
const router = express.Router()
const meController = require('..//app/controller/MeController')
const billsController = require('../app/controller/BillsController')
const softMiddleware = require('../app/middlewarse/softMiddlewarse')

router.get('/infomation', meController.infomation)
router.get('/mybills', softMiddleware, billsController.myBills)

module.exports = router