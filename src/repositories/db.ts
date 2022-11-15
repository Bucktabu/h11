import * as dotenv from "dotenv";
dotenv.config()

import mongoose from 'mongoose';
import {BlogConstructor} from "../types/blogs-constructor";
import {CommentBDConstructor} from "../types/comment-constructor";
import {DeviceSecurityConstructor} from "../types/deviceSecurity-constructor";
import {EmailConfirmationConstructor} from "../types/emailConfirmation-constructor";
import {PostConstructor} from "../types/posts-constructor";
import {TokenConstructor} from "../types/token-constructor";
import {UserDBConstructor} from "../types/user-constructor";
import {UserIpAddressConstructor} from "../types/UserIpAddress-constructor";
///?maxPoolSize=20&w=majority
const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017'
const dbName = process.env.mongoDBName || 'blogPlatform'

export async function runDb() {
    try {
        await mongoose.connect(mongoUri, {dbName});
        console.log(`Connected successfully to mongo server: ${mongoUri}`)
    } catch {
        console.log('Can`t connect to db')
        await mongoose.disconnect()
    }
}