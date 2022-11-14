import {UserDB} from "./user";

declare global {
    declare namespace Express {
        export interface  Request {
            user: UserDB | null
        }
    }
} // расширение типов