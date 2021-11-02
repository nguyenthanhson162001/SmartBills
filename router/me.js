const express = require('express');
const router = express.Router()
const meController = require('..//app/controller/MeController')
const billController = require('../app/controller/BillController')
const softMiddleware = require('../app/middlewarse/softMiddlewarse')

router.get('/infomation', meController.infomation)
router.get('/mybills', softMiddleware, billController.myBills)

module.exports = router