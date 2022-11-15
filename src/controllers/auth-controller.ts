import {Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import {JWTService} from "../application/jws-service";
import {SecurityService} from "../domain/security-service";
import {emailConfirmationRepository} from "../repositories/emailConfirmation-repository";
import {emailsManager} from "../managers/email-manager";
import {AuthService} from "../domain/auth-service";
import {UsersService} from "../domain/users-service";

export class AuthController {
    constructor(protected authService: AuthService,
                protected jwsService: JWTService,
                protected securityService: SecurityService,
                protected usersService: UsersService) {}

    async aboutMe(req: Request, res: Response) {
        const aboutMe = await this.usersService.aboutMe(req.user!)

        return res.status(200).send(aboutMe)
    }

    async login(req: Request, res: Response) {
        const deviceId = uuidv4()
        const token = await this.jwsService.createToken(req.user!.id, deviceId)
        const tokenPayload = await this.jwsService.giveTokenPayload(token.refreshToken)

        await this.securityService.createUserDevice(tokenPayload, req.ip) // can check and send 404

        //console.log('----->> refreshToken', token.refreshToken)
        return res.status(200)
            .cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
            .send({accessToken: token.accessToken})
    }

    async passwordRecovery(req: Request, res: Response) {
        const user = await this.usersService.giveUserByIdOrLoginOrEmail(req.body.email)

        if (user) {
            const newRecoveryCode = uuidv4()
            await emailConfirmationRepository.updateConfirmationCode(user.id, newRecoveryCode)
            await emailsManager.sendPasswordRecoveryEmail(req.body.email, newRecoveryCode)
            console.log('createdRecoveryCode:', newRecoveryCode)
        }

        return res.sendStatus(204)
    }

    async createNewPassword(req: Request, res: Response) {
        const emailConfirmation = await emailConfirmationRepository
            .giveEmailConfirmationByCodeOrId(req.body.recoveryCode)

        if (!emailConfirmation) {
            return res.status(400)
                .send({errorsMessages: [{ message: 'Incorrect recovery code', field: "recoveryCode" }]})
        }

        const user = await this.usersService.giveUserByIdOrLoginOrEmail(emailConfirmation.id)

        if (!user) {
            return res.sendStatus(404)
        }

        await this.usersService.updateUserPassword(user.id, req.body.newPassword)

        return res.sendStatus(204)
    }

    async registration(req: Request, res: Response) {
        await this.authService.createUser(req.body.login, req.body.password, req.body.email)

        return res.sendStatus(204)
    }

    async registrationConfirmation(req: Request, res: Response) {
        const emailConfirmed = await this.authService.confirmEmail(req.body.code)

        if (!emailConfirmed) {
            return res.status(400)
                .send({errorsMessages: [{ message: 'Bad Request', field: "code" }]})
        }

        return res.sendStatus(204)
    }

    async registrationEmailResending(req: Request, res: Response) {
        const result = await this.authService.resendConfirmRegistration(req.body.email)

        if (!result) {
            return res.status(400).send({ errorsMessages: [{ message: 'Wrong email', field: "email" }]})
        }

        return res.sendStatus(204)
    }

    async createRefreshToken(req: Request, res: Response) {
        const token = await this.securityService.createNewRefreshToken(req.cookies.refreshToken, req.body.tokenPayload)

        return res.status(200)
            .cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
            .send({accessToken: token.accessToken})
    }

    async logout(req: Request, res: Response) {
        await this.securityService.logoutFromCurrentSession(req.cookies.refreshToken)

        return res.sendStatus(204)
    }
}