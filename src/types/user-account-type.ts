import {EmailConfirmationType} from "./email-confirmation-type";
import {UserDB} from "./user";

export class UserAccountType {
    constructor(
        public accountData: UserDB,
        public emailConfirmation: EmailConfirmationType
    ) {}
}
