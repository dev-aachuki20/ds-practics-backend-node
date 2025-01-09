const Joi = require('joi');

const updateProfileSchema = Joi.object({
    first_name: Joi.string().allow(null, '').trim(),
    last_name: Joi.string().allow(null, '').trim(),
    mobile_number: Joi.string().allow(null, '').trim(),
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().trim(),
    newPassword: Joi.string().min(8).required().trim(),
});


module.exports = { updateProfileSchema, changePasswordSchema };