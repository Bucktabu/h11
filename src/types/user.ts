export class User {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string
    ) {}
}

export type UsersType = User[]

export class UserDB {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public passwordHash: string,
        public passwordSalt: string,
        public createdAt: string
    ) {}
}

export class UserDB2 {
    public id: string
    public login: string
    constructor(id: string, login: string) {
        this.id = id
        this.login = login
    }
}