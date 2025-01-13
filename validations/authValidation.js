const Joi = require('joi');

const registrationSchema = Joi.object({
    first_name: Joi.string().allow(null, '').trim(),
    last_name: Joi.string().allow(null, '').trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().required(),
    mobile_number: Joi.string().allow(null, '').trim(),
    status: Joi.boolean().default(true),
    role: Joi.number().default(2),
    image: Joi.string().allow(null, '').trim(),
    token: Joi.string().allow(null, '').trim(),
    resetToken: Joi.string().allow(null, '').trim(),
    resetTokenExpiration: Joi.date().allow(null),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().trim(),
});

const reserPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().required(),
});


module.exports = { registrationSchema, loginSchema, forgotPasswordSchema, reserPasswordSchema };