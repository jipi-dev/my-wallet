// Validation
const Joi = require('@hapi/joi');

// Wallet validation
module.exports = Joi.object({
        name: Joi.string().min(3).required(),
        cryptos: Joi.array().items(
          Joi.object({
            code: Joi.string().min(2).required(),
            amount: Joi.number().min(1).required(),
          }),
        ),
    });
