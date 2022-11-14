export class UserType {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string
    ) {}
}

export type UsersType = UserType[]

export class UserDBType {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public passwordHash: string,
        public passwordSalt: string,
        public createdAt: string
    ) {}
}