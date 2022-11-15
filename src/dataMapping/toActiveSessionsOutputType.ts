import {DeviceSecurityConstructor} from "../types/deviceSecurity-constructor";

export const activeSessionsOutputType = (device: DeviceSecurityConstructor) => {
    return {
        deviceId: device.userDevice.deviceId,
        title: device.userDevice.deviceTitle,
        ip: device.userDevice.ipAddress,
        lastActiveDate: new Date(Number(device.userDevice.iat)).toISOString()
    }
}