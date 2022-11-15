import {Request, Response} from "express";
import {SecurityService} from "../domain/security-service";

export class SecurityController {
    constructor(protected securityService: SecurityService) {}

    async getAllActiveSessions(req: Request, res: Response) {
        const activeSessions = await this.securityService.giveAllActiveSessions(req.user!.id) // can check and send 404

        return res.status(200).send(activeSessions)
    }

    async deleteAllActiveSessions(req: Request, res: Response) {
        const result = await this.securityService.deleteAllActiveSessions(req.user!.id, req.body.tokenPayload.deviceId)

        if (!result) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }

    async deleteActiveSessionsById(req: Request, res: Response) {
        const userDevice = await this.securityService.giveDeviceById(req.params.deviceId)

        if (!userDevice) {
            return res.sendStatus(404)
        }

        if (userDevice.userId !== req.user!.id) {
            return res.sendStatus(403)
        }

        const isDeleted = await this.securityService.deleteDeviceById(req.params.deviceId)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
}