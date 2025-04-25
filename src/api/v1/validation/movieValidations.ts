import Joi, { ObjectSchema } from "joi";

export const movieSchema: ObjectSchema = Joi.object({
    id: Joi.string().optional().messages({
        "string.empty": "ID cannot be empty", 
    }),
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
    }),
    description: Joi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
    }),
    price: Joi.string().required().messages({
        "any.required": "Price is required",
        "string.empty": "Price cannot be empty",
    }),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
});

export const deleteMovieSchema: ObjectSchema = Joi.object({
    id: Joi.string()
        .required()
        .messages({ "string.empty": "Item ID cannot be empty" }),
});

export const movieParamSchema = Joi.object({
    id: Joi.string().required().messages({ "any.required": "Movie ID is required" }),
  });