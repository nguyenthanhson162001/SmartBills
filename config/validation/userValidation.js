const Joi = require('joi')
const { object, string } = Joi.types();

const registerValidation = (user) => {
    const Schema = Joi.object({
        email: Joi.string()
            .min(6)
            .max(255)
            .email(),
        password: Joi.string()
            .max(60)
            .min(6),
        lastName: Joi.string()
            .max(35)
            .required(),
        firstName: Joi.string()
            .max(35)
            .required(),
    })
    return Schema.validate(user)
}
const loginValidation = (user) => {
    const Schema = Joi.object({
        email: Joi.string()
            .min(6)
            .max(255)
            .email(),
        password: Joi.string()
            .max(60)
            .min(6)
    })
    return Schema.validate(user)
}
module.exports = { registerValidation, loginValidation }