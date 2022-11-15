import {UserDBConstructor} from "./user-constructor";

declare global {
    declare namespace Express {
        export interface  Request {
            user: UserDBConstructor | null
        }
    }
} // расширение типов