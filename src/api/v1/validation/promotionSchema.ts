import Joi, { ObjectSchema } from "joi";

export const promotionSchema: ObjectSchema = Joi.object({
    id: Joi.string().optional().messages({
        "string.empty": "ID cannot be empty", 
    }),
    title: Joi.string().required().messages({
        "any.required": "Title is required",
        "string.empty": "Title cannot be empty",
    }),
    description: Joi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
    }),
    discount: Joi.string().required().messages({
        "any.required": "Discount is required",
        "string.empty": "Discount cannot be empty",
    }),
    startDate: Joi.date().required().messages({
        "any.required": "Start Date is required",
    }),
    endDate: Joi.date().required().messages({
        "any.required": "End Date is required",
    }),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
});

export const deletePromotionSchema: ObjectSchema = Joi.object({
    id: Joi.string()
        .required()
        .messages({ "string.empty": "Promotion ID cannot be empty" }),
});

export const promotionParamSchema = Joi.object({
    id: Joi.string().required().messages({ "any.required": "Promotion ID is required" }),
});
