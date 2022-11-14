import {UserDeviceType} from "./userDevice-type";

export class  DeviceSecurityType {
    constructor(
        public userId: string,
        public userDevice: UserDeviceType
    ) {}
}