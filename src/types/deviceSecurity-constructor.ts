import {UserDeviceConstructor} from "./user-device-type";
import {CommentBDConstructor} from "./comment-constructor";

export class DeviceSecurityConstructor {
    constructor(
        public userId: string,
        public userDevice: UserDeviceConstructor
    ) {}
}