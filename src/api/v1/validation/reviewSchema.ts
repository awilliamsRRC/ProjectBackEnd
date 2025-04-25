import Joi, { ObjectSchema } from "joi";

export const reviewSchema: ObjectSchema = Joi.object({
    id: Joi.string().optional().messages({
        "string.empty": "ID cannot be empty", 
    }),
    movieId: Joi.string().required().messages({
        "any.required": "Movie ID is required",
        "string.empty": "Movie ID cannot be empty",
    }),
    reviewer: Joi.string().required().messages({
        "any.required": "Reviewer name is required",
        "string.empty": "Reviewer name cannot be empty",
    }),
    rating: Joi.number().min(1).max(5).required().messages({
        "any.required": "Rating is required",
        "number.base": "Rating must be a number",
        "number.min": "Rating must be between 1 and 5",
        "number.max": "Rating must be between 1 and 5",
    }),
    comment: Joi.string().required().messages({
        "any.required": "Comment is required",
        "string.empty": "Comment cannot be empty",
    }),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
});

export const deleteReviewSchema: ObjectSchema = Joi.object({
    id: Joi.string()
        .required()
        .messages({ "string.empty": "Review ID cannot be empty" }),
});

export const reviewParamSchema = Joi.object({
    id: Joi.string().required().messages({ "any.required": "Review ID is required" }),
});
