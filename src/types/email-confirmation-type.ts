export class EmailConfirmationType {
    constructor(
        public id: string,
        public confirmationCode: string,
        public expirationDate: Date,
        public isConfirmed: boolean
    ) {}
}