import {EmailConfirmationConstructor} from "./emailConfirmation-constructor";
import {UserDBConstructor} from "./user-constructor";

export class UserAccountConstructor {
    constructor(
        public accountData: UserDBConstructor,
        public emailConfirmation: EmailConfirmationConstructor
    ) {}
}
