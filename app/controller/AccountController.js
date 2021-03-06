const User = require('..//models/user')
const userValidation = require('..//..//config/validation/userValidation')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer_config = require('..//..//config/mail/nodemailer')
require('dotenv').config()
class AccountController {
    // [POST] api/account/login
    async login(req, res, next) {
        const { email, password } = req.body
        // validate the data before check
        const { error } = userValidation.loginValidation({ email, password })
        if (error) {
            send(false, error.details[0].message, '')
            return
        }
        // checking already exist
        const user = await User.findOne({ email })
        if (!user) {
            send(false, 'Email not already exist', '')
            return
        }
        const hasValidPassword = await bcryptjs.compare(password, user.password)
        if (!hasValidPassword) {
            send(false, 'Password not correct', '')
            return
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' })
        res.header('auth-token', token)
            .status(200).json({
                status: true,
                error: '',
                auth_token: token
            })
        function send(status, error, auth_token) {
            res.status(200).json({
                status,
                error,
                auth_token
            })
        }
    }
    // [POST] api/account/register
    async register(req, res, next) {
        const { email, password, firstName, lastName } = req.body
        const { error } = userValidation.registerValidation({ email, password, firstName, lastName })
        if (error) {
            send(200, false, error.details[0].message)
            return
        }
        // hash password
        // checking if the user is already in the database
        const emailExist = await User.findOne({ email })
        if (emailExist) {
            send(200, false, 'Email already exist')
            return
        }

        // const salt = await bcrypt.genSalt(parseInt(process.env.SALROUNDSNUMBER))
        const user = new User({
            lastName: lastName.toLowerCase(),
            firstName: firstName.toLowerCase(),
            provider: 'local',
            email: email.toLowerCase()
        })

        const hasherPassword = await bcryptjs.hash(password, parseInt(process.env.SALROUNDSNUMBER))
        user.password = hasherPassword
        console.log(hasherPassword)
        console.log(process.env.JWT_ACC_ACTIVE,)
        const token = jwt.sign({ user }, process.env.JWT_ACC_ACTIVE, { expiresIn: '30m' })
        console.log(token)
        var message = `<h3>Ch??o ${req.body.firstName} ${req.body.lastName}</h3> <span> C???m ??n b???n ???? ????ng nh???p v??o
        <a href='http://${req.headers.host}' >http://${req.headers.host}</a> </span> <br>
            <span> N???u ????y l?? b???n vui l??ng <a href='http://${req.headers.host}/api/account/verify/${token}'> nh???n v??o ????y ????? x??c th???c t??i kho???ng</a></span> <br>
                <small>*** ???????ng d???n ch??? c?? hi???u l???c trong 30 ph??t <small>
                    `
        nodemailer_config.sendEmail(req.body.email, 'X??c th???c t??i kho???ng TOL GRROP', message)
        res.json({
            status: true,
            error: ""
        })

        function send(numberStatus, status, error) {
            res.status(numberStatus).json({
                status,
                error
            })
        }
    }
    // [POST] api/account/verify
    async verifyEmail(req, res) {
        // create new user
        const { token } = req.params
        if (!token) {
            res.send('Invalid token')
        }
        jwt.verify(token, process.env.JWT_ACC_ACTIVE, function (err, data) {
            if (err || !data || !data.user) {
                res.send('X??c th???c t??i kho???ng th???t b???i')
                return
            }
            const { user } = data

            new User(user).save()
            res.send('X??c th???c t??i kho???ng th??nh c??ng')
        })
    }

}
module.exports = new AccountController;