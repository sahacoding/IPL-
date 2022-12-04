const Joi = require ('joi');

module.exports.tmSchema = Joi.object({
   // tmarray: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        state: Joi.string().required(),
        rating: Joi.number().required().min(0),

   // }).required()
   
})

module.exports.plyrSchema = Joi.object({
   // plyrarray: Joi.object({
        name: Joi.string().required(),
        img: Joi.string().required(),
       age: Joi.number().required().min(0),
       country: Joi.string().required(),
       category: Joi.string().required(),
   // }).required()
})