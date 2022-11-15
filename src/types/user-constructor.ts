export class UserConstructor {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string
    ) {}
}

export type UsersType = UserConstructor[]

export class UserDBConstructor {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public passwordSalt: string,
        public passwordHash: string,
        public createdAt: string
    ) {}
}

// export class UserDB2 {
//     public id: string
//     public login: string
//     constructor(id: string, login: string) {
//         this.id = id
//         this.login = login
//     }
// }