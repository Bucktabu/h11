import {authentication} from "./validation-middleware/authentication";
import {commentsValidation} from "./validation-middleware/commentRouter-validation";
import {inputValidation} from "./validation-middleware/input-validation";
import {notYourComment} from "./validation-middleware/notYourComment-validation";
import {likeStatusValidation} from "./validation-middleware/likeStatus-validation";

export const deleteCommentByIdMiddleware = [authentication, notYourComment]
export const updateCommentMiddleware = [authentication, notYourComment, commentsValidation, inputValidation]
export const likeStatusMiddleware = [authentication, likeStatusValidation, inputValidation]