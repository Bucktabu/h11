export class UserIpAddressConstructor {
    constructor(
        public ipAddress: string,
        public endpoint: string,
        public connectionAt: number
    ) {}
}