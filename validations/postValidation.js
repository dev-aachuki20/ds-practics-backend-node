const Joi = require('joi');

const postSchema = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    status: Joi.number().valid(0, 1).optional(),
    image: Joi.array().optional(),
});


const postUpdateSchema = Joi.object({
    title: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    status: Joi.number().valid(0, 1).optional(),
    image: Joi.array().optional(),
});



module.exports = { postSchema, postUpdateSchema };