import {Router} from "express";
import {limiterAndEmailValidation,
        getAuthRouterMiddleware,
        postAuthRouterMiddleware,
        postRegistrationMiddleware,
        limiterAndPasswordValidation} from "../middlewares/authRouter-middleware";
import {ipAddressLimiter} from "../middlewares/validation-middleware/ipAddressLimiter";
import {refreshTokenValidation} from "../middlewares/validation-middleware/refreshToken-validation";
import {authController} from "../composition-root";

export const authRouter = Router({})

authRouter.get('/me',
    getAuthRouterMiddleware, authController.aboutMe.bind(authController))

authRouter.post('/login',
    ...postAuthRouterMiddleware, authController.login.bind(authController))

authRouter.post('/password-recovery',
    ...limiterAndEmailValidation, authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    ...limiterAndPasswordValidation, authController.createNewPassword.bind(authController))

authRouter.post('/registration',
    postRegistrationMiddleware, authController.registration.bind(authController))

authRouter.post('/registration-confirmation',
    ipAddressLimiter, authController.registrationConfirmation.bind(authController))

authRouter.post('/registration-email-resending',
    ...limiterAndEmailValidation,authController.registrationEmailResending.bind(authController))

authRouter.post('/refresh-token',
    refreshTokenValidation, authController.createRefreshToken.bind(authController))

authRouter.post('/logout',
    refreshTokenValidation, authController.logout.bind(authController))