export class UserDeviceConstructor {
    constructor(
        public deviceId: string,
        public deviceTitle: string,
        public browser: string,
        public ipAddress: string,
        public iat: string,
        public exp: string
    ) {}
}