// const Joi = require('joi');

// module.exports.listingSchema=Joi.object({
//     listing : Joi.object({
//         title:Joi.string().required(),
//         description :Joi.string().required(),
//         location :Joi.string().required(),
//         country:Joi.string().required(),
//         price:Joi.number().required(),
//         image: Joi.string().allow("",null),
//     }).required(),
// });
const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        image: Joi.string().allow(""),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

//1st step for backend validation then 2nd step require in app.js 3rd step validate review in app.js,4th is to write validatereview as middleware in app.post for clientside and wrapasync. 
const reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
})

module.exports={
    listingSchema,
    reviewSchema,
};