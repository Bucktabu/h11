import {NextFunction, Request, Response} from "express";
import {jwtService, usersService} from "../../composition-root";


export const authentication = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const accessToken = req.headers.authorization.split(' ')[1]

    const userInfo = await jwtService.giveTokenPayload(accessToken)

    if (!userInfo) {
        return res.sendStatus(401)
    }

    const user: any = await usersService.giveUserByIdOrLoginOrEmail(userInfo.userId)

    if (!user) {
        return res.sendStatus(401)
    }

    req.user = user
    next()
}