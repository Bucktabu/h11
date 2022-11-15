import mongoose from "mongoose";
import {UserIpAddressConstructor} from "../types/UserIpAddress-constructor";

const ipAddressScheme = new mongoose.Schema<UserIpAddressConstructor>({
    ipAddress: {type: String, required: true},
    endpoint: {type: String, required: true},
    connectionAt: {type: Number, required: true}
})

export const IpAddressScheme = mongoose.model('ipAddress', ipAddressScheme)