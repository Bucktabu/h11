import {TokenBlackListScheme} from "../schemes/tokenBlackList-scheme";

export class JWTBlackList {
    async addTokenInBlackList(refreshToken: string) {
        return TokenBlackListScheme.create({refreshToken})
    }

    async giveToken(refreshToken: string) {
        return TokenBlackListScheme.findOne({refreshToken})
    }

    async deleteAll(): Promise<boolean> {
        try {
            await TokenBlackListScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('TokenBlackListScheme => deleteAll =>', e)
            return false
        }
    }
}

export const jwtBlackList = new JWTBlackList()