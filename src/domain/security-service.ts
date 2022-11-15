import UserAgent from "user-agents";
import {jwsService} from "../application/jws-service";
import {securityRepository} from "../repositories/security-repository";
import {DeviceSecurityConstructor} from "../types/deviceSecurity-constructor";

import {createToken} from "../helperFunctions";
import {activeSessionsOutputType} from "../dataMapping/toActiveSessionsOutputType";
import {UserDeviceConstructor} from "../types/user-device-type";

class SecurityService {
    async createUserDevice(tokenPayload: any, ipAddress: string): Promise<boolean> {
        const userDeviceInfo: any = new UserAgent().data

        const userDevice = new UserDeviceConstructor(
            tokenPayload.deviceId,
            userDeviceInfo.deviceCategory,
            userDeviceInfo.userAgent,
            ipAddress,
            tokenPayload.iat,
            tokenPayload.exp
        )

        const createDevice = new DeviceSecurityConstructor(
            tokenPayload.userId,
            userDevice
        )

        const createdDevice = await securityRepository.createUserDevice(createDevice)

        if (!createdDevice) {
            return false
        }

        return true
    }

    async createNewRefreshToken(refreshToken: string, tokenPayload: any) {
        await jwsService.addTokenInBlackList(refreshToken)
        const token = await createToken(tokenPayload.userId, tokenPayload.deviceId)
        const newTokenPayload = await jwsService.giveTokenPayload(token.refreshToken)
        await securityService.updateCurrentActiveSessions(newTokenPayload.deviceId, newTokenPayload.iat, newTokenPayload.exp)

        return token
    }

    async giveAllActiveSessions(userId: string) {
        const activeSessions = await securityRepository.giveAllActiveSessions(userId)

        if (!activeSessions) {
            return null
        }

        return activeSessions.map(activeSession => activeSessionsOutputType(activeSession))
    }

    async giveDeviceById(deviceId: string): Promise<DeviceSecurityConstructor | null> {
        const device = await securityRepository.giveDeviseById(deviceId)

        if (!device) {
            return null
        }

        return device
    }

    async updateCurrentActiveSessions(deviceId: string, iat: string, exp: string) {
        return await securityRepository.updateCurrentActiveSessions(deviceId, iat, exp)
    }

    async logoutFromCurrentSession(refreshToken: string) {
        await jwsService.addTokenInBlackList(refreshToken)
        const tokenPayload = await jwsService.giveTokenPayload(refreshToken)
        await securityRepository.deleteDeviceById(tokenPayload.deviceId)

        return
    }

    async deleteDeviceById(deviceId: string): Promise<boolean> {
        return await securityRepository.deleteDeviceById(deviceId)
    }

    async deleteAllActiveSessions(userId: string, deviceId: string): Promise<boolean> {
        return  await securityRepository.deleteAllActiveSessions(userId, deviceId)
    }
}

export const securityService = new SecurityService()