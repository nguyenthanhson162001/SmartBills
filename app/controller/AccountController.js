const User = require('..//models/user')
const userValidation = require('..//..//config/validation/userValidation')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.header('auth-token', token)
            .status(200).json({
                status: true,
                error: '',
                auth_token: token
            })
        function send(status, error, auth_token) {
            res.status(400).json({
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
            send(500, false, error.details[0].message)
            return
        }
        // hash password

        // checking if the user is already in the database
        const emailExist = await User.findOne({ email })
        if (emailExist) {
            send(400, false, 'Email already exist')
            return
        }

        const salt = await bcryptjs.genSalt(12)
        const hashedPassword = await bcryptjs.hash(password, salt)
        // create new user
        const user = new User({
            lastName: lastName.toLowerCase(),
            firstName: firstName.toLowerCase(),
            provider: 'local',
            email: email.toLowerCase(),
            password: hashedPassword
        })
        try {
            const saveUser = await user.save();
            // const token = jwt.sign({ _id: saveUser._id }, process.env.JWT_SECRET)
            send(500, true, '')

        } catch (error) {
            send(500, false, 'Server save error')
        }
        function send(numberStatus, status, error) {
            res.status(numberStatus).json({
                status,
                error
            })
        }
    }
}
module.exports = new AccountController;