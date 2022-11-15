import mongoose from "mongoose";
import {TokenConstructor} from "../types/token-constructor";

const tokenBlackListScheme = new mongoose.Schema<TokenConstructor>({
    refreshToken: {type: String, required: true}
})

export const TokenBlackListScheme = mongoose.model('blackList', tokenBlackListScheme)