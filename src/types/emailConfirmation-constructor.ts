import {CommentBDConstructor} from "./comment-constructor";

export class EmailConfirmationConstructor {
    constructor(
        public id: string,
        public confirmationCode: string,
        public expirationDate: Date,
        public isConfirmed: boolean
    ) {}
}