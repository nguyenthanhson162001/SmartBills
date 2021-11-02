const express = require('express');
const router = express.Router()
const accountController = require('..//app/controller/AccountController')

router.post('/login', accountController.login)
router.post('/register', accountController.register)

module.exports = router