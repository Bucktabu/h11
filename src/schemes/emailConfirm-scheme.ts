import mongoose from "mongoose";
import {EmailConfirmationConstructor} from "../types/emailConfirmation-constructor";

const emailConfirmScheme = new mongoose.Schema<EmailConfirmationConstructor>({
    id: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
})

export const EmailConfirmationScheme = mongoose.model('emailConfirm', emailConfirmScheme)