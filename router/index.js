const account = require('./account')
const me = require('./me')
const bill = require('./bill')
const verifyMiddleware = require('..//app/middlewarse/verifyToken')
function router(app) {
    app.use('/api/account', account)
    app.use('/api/me', verifyMiddleware, me)
    app.use('/api/bill', bill)
    app.get('/', (req, res) => res.status(200).send(`Well come you  visit to my server !!! This is server login API, ;;; login: /api/account/login - method: POST - {email,password}
    ;;; register: /api/account/register - method: POST - {email,password,lastName,firstName}
    ;;; infomation: /api/me/infomation -  method: GET - auth-token: --- `))
}

module.exports = router;