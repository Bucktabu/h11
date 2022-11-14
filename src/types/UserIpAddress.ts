export class UserIpAddressType {
    constructor(
        public ipAddress: string,
        public endpoint: string,
        public connectionAt: number
    ) {}
}