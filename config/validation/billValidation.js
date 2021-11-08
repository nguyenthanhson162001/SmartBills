const Joi = require('joi')

const billValidation = (bill) => {
    const Schema = Joi.object({
        total: Joi.number().
            required()
        ,
        dateTime: Joi.string()
            .max(100)
            .required()
        ,
        address: Joi.string()
            .max(255)
            .required()
    })
    return Schema.validate(bill)
}

module.exports = { billValidation }