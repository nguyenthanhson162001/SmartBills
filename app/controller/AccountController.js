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
            res.status(400).json({
                status: false,
                error: error.details[0].message
            })
            return
        }
        // checking already exist
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({
                status: false,
                error: 'Email not already exist'
            })
            return
        }
        const hasValidPassword = await bcryptjs.compare(password, user.password)
        if (!hasValidPassword) {
            res.status(400).json({
                status: false,
                error: 'Password not correct'
            })
            return
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.header('auth-token', token)
            .status(200).json({
                status: true,
                auth_token: token
            })
    }
    // [POST] api/account/register
    async register(req, res, next) {
        const { email, password, firstName, lastName } = req.body
        const { error } = userValidation.registerValidation({ email, password, firstName, lastName })
        if (error) {
            res.status(400).json({
                status: false,
                error: error.details[0].message
            })
            return
        }
        // hash password

        // checking if the user is already in the database
        const emailExist = await User.findOne({ email })
        if (emailExist) {
            res.status(400).json({
                status: false,
                error: 'Email already exist'
            })
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
            const token = jwt.sign({ _id: saveUser._id }, process.env.JWT_SECRET)
            res.status(200).json({
                status: true,
                auth_token: token
            })
        } catch (error) {
            res.status(500).json({
                status: false,
            })
        }
    }
}
module.exports = new AccountController;