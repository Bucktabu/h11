import {EmailConfirmationType} from "./email-confirmation-type";
import {UserDBType} from "./user-type";

export class UserAccountType {
    constructor(
        public accountData: UserDBType,
        public emailConfirmation: EmailConfirmationType
    ) {}
}