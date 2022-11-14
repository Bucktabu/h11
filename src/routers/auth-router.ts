import {Request, Response, Router} from "express";
import {v4 as uuidv4} from "uuid";
import {authService} from "../domain/auth-service";
import {securityService} from "../domain/security-service";
import {jwsService} from "../application/jws-service";
import {usersService} from "../domain/users-service";
import {limiterAndEmailValidation,
        getAuthRouterMiddleware,
        postAuthRouterMiddleware,
        postRegistrationMiddleware,
        limiterAndPasswordValidation} from "../middlewares/authRouter-middleware";
import {refreshTokenValidation} from "../middlewares/validation-middleware/refreshToken-validation";
import {createToken} from "../helperFunctions";
import {ipAddressLimiter} from "../middlewares/validation-middleware/ipAddressLimiter";
import {emailsManager} from "../managers/email-manager";
import {emailConfirmationRepository} from "../repositories/emailConfirmation-repository";
import {usersRepository} from "../repositories/users-repository";

export const authRouter = Router({})

class AuthController {
    async aboutMe(req: Request, res: Response) {
        const aboutMe = await usersService.aboutMe(req.user!)

        return res.status(200).send(aboutMe)
    }

    async login(req: Request, res: Response) {
        const deviceId = uuidv4()
        const token = await createToken(req.user!.id, deviceId)
        const tokenPayload = await jwsService.giveTokenPayload(token.refreshToken)

        await securityService.createUserDevice(tokenPayload, req.ip) // can check and send 404

        //console.log('----->> refreshToken', token.refreshToken)
        return res.status(200)
            .cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
            .send({accessToken: token.accessToken})
    }

    async passwordRecovery(req: Request, res: Response) {
        const user = await usersRepository.giveUserByLoginOrEmail(req.body.email)

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

        const user = await usersService.giveUserById(emailConfirmation.id)

        if (!user) {
            return res.sendStatus(404)
        }

        await usersService.updateUserPassword(user.id, req.body.newPassword)

        return res.sendStatus(204)
    }

    async registration(req: Request, res: Response) {
        await authService.createUser(req.body.login, req.body.password, req.body.email, req.ip)

        return res.sendStatus(204)
    }

    async registrationConfirmation(req: Request, res: Response) {
        const emailConfirmed = await authService.confirmEmail(req.body.code)

        if (!emailConfirmed) {
            return res.status(400)
                .send({errorsMessages: [{ message: 'Bad Request', field: "code" }]})
        }

        return res.sendStatus(204)
    }

    async registrationEmailResending(req: Request, res: Response) {
        const result = await authService.resendConfirmRegistration(req.body.email)

        if (!result) {
            return res.status(400).send({ errorsMessages: [{ message: 'Wrong email', field: "email" }]})
        }

        return res.sendStatus(204)
    }

    async createRefreshToken(req: Request, res: Response) {
        const token = await securityService.createNewRefreshToken(req.cookies.refreshToken, req.body.tokenPayload)

        return res.status(200)
            .cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
            .send({accessToken: token.accessToken})
    }

    async logout(req: Request, res: Response) {
        await securityService.logoutFromCurrentSession(req.cookies.refreshToken)

        return res.sendStatus(204)
    }
}

const authControllerInstance = new AuthController()

authRouter.get('/me',
    getAuthRouterMiddleware, authControllerInstance.aboutMe)

authRouter.post('/login',
    ...postAuthRouterMiddleware, authControllerInstance.login)

authRouter.post('/password-recovery',
    ...limiterAndEmailValidation, authControllerInstance.passwordRecovery)

authRouter.post('/new-password',
    ...limiterAndPasswordValidation, authControllerInstance.createNewPassword)

authRouter.post('/registration',
    postRegistrationMiddleware, authControllerInstance.registration)

authRouter.post('/registration-confirmation',
    ipAddressLimiter, authControllerInstance.registrationConfirmation)

authRouter.post('/registration-email-resending',
    ...limiterAndEmailValidation,authControllerInstance.registrationEmailResending)

authRouter.post('/refresh-token',
    refreshTokenValidation, authControllerInstance.createRefreshToken)

authRouter.post('/logout',
    refreshTokenValidation, authControllerInstance.logout)