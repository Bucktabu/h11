import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {JWTBlackList} from "../repositories/jwtBlackList";

export class JWTService {
    constructor(protected jwtBlackList: JWTBlackList) {}

    async createJWT(userId: string, deviceId: string, timeToExpired: number) {
        return jwt.sign({userId, deviceId}, settings.JWT_SECRET, {expiresIn: `${timeToExpired}s`})
    }

    async giveTokenPayload(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            return result
        } catch (error) {
            return null
        }
    }

    async addTokenInBlackList(refreshToken: string) {
        return await this.jwtBlackList.addTokenInBlackList(refreshToken)
    }

    async checkTokenInBlackList(refreshToken: string) {
        return await this.jwtBlackList.giveToken(refreshToken)
    }

    async createToken(userId: string, deviceId: string) {
        const accessToken = await this.createJWT(userId, deviceId, 5 * 60 * 1000)
        const refreshToken = await this.createJWT(userId, deviceId, 10 * 60 * 1000)

        return {accessToken, refreshToken}
    }
}