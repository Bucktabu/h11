import {body} from "express-validator";
import {LikesModel} from "../../models/likes-model";

export const likeStatusValidation = body('likeStatus').isString().trim()
    .custom(async (likeStatus) => {
        const likeStatusModel = Object.values(LikesModel)

        if (!likeStatusModel.includes(likeStatus as LikesModel)) {
            throw new Error('Incorrect input data')
        }

        return true
    })