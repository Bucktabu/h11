import UserAgent from "user-agents";
import {JWTService} from "../application/jws-service";
import {SecurityRepository} from "../repositories/security-repository";
import {DeviceSecurityConstructor} from "../types/deviceSecurity-constructor";
import {activeSessionsOutputType} from "../dataMapping/toActiveSessionsOutputData";
import {UserDeviceConstructor} from "../types/user-device-type";

export class SecurityService {
    constructor(protected jwsService: JWTService,
                protected securityRepository: SecurityRepository) {}

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

        const createdDevice = await this.securityRepository.createUserDevice(createDevice)

        if (!createdDevice) {
            return false
        }

        return true
    }

    async createNewRefreshToken(refreshToken: string, tokenPayload: any) {
        await this.jwsService.addTokenInBlackList(refreshToken)
        const token = await this.jwsService.createToken(tokenPayload.userId, tokenPayload.deviceId)
        const newTokenPayload = await this.jwsService.giveTokenPayload(token.refreshToken)
        await this.securityRepository.updateCurrentActiveSessions(newTokenPayload.deviceId, newTokenPayload.iat, newTokenPayload.exp)

        return token
    }

    async giveAllActiveSessions(userId: string) {
        const activeSessions = await this.securityRepository.giveAllActiveSessions(userId)

        if (!activeSessions) {
            return null
        }

        return activeSessions.map(activeSession => activeSessionsOutputType(activeSession))
    }

    async giveDeviceById(deviceId: string): Promise<DeviceSecurityConstructor | null> {
        const device = await this.securityRepository.giveDeviseById(deviceId)

        if (!device) {
            return null
        }

        return device
    }

    async logoutFromCurrentSession(refreshToken: string) {
        await this.jwsService.addTokenInBlackList(refreshToken)
        const tokenPayload = await this.jwsService.giveTokenPayload(refreshToken)
        await this.securityRepository.deleteDeviceById(tokenPayload.deviceId)

        return
    }

    async deleteDeviceById(deviceId: string): Promise<boolean> {
        return await this.securityRepository.deleteDeviceById(deviceId)
    }

    async deleteAllActiveSessions(userId: string, deviceId: string): Promise<boolean> {
        return  await this.securityRepository.deleteAllActiveSessions(userId, deviceId)
    }
}