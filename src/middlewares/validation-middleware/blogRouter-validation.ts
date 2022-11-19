import {body} from "express-validator";

export const nameValidation = body('name').isString().trim().isLength({min: 3, max: 15})
export const descriptionValidation = body('description').isString().trim().isLength({min: 3, max: 500})
export const websiteUrValidation = body('websiteUrl').isString().trim().isURL().isLength({min: 5, max: 100})