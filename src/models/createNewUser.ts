export class CreateNewUser {
    constructor(
        /**
         *  Create new user with login, password and email
         */
        public login: string,
        public password: string,
        public email: string
    ) {}
}