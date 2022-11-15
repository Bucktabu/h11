import {Router} from "express";
import {refreshTokenValidation} from "../middlewares/validation-middleware/refreshToken-validation";
import {securityController, } from "../composition-root";

export const securityRouter = Router({})

securityRouter.get('/devices',
    refreshTokenValidation, securityController.getAllActiveSessions.bind(securityController))

securityRouter.delete('/devices',
    refreshTokenValidation, securityController.deleteAllActiveSessions.bind(securityController))

securityRouter.delete('/devices/:deviceId',
    refreshTokenValidation, securityController.deleteActiveSessionsById.bind(securityController))