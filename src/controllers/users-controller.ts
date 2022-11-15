import {Response} from "express";
import {UsersService} from "../domain/users-service";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {RequestWithBody,
        RequestWithParams,
        RequestWithQuery} from "../types/request-types";
import {QueryParameters} from "../models/queryParameters";
import {CreateNewUser} from "../models/createNewUser";
import {URIParameters} from "../models/URIParameters";

export class UsersController {
    constructor(protected usersService: UsersService) {}

    async getUsersPage(req: RequestWithQuery<QueryParameters>, res: Response) {
        const pageWithUsers: ContentPageConstructor = await this.usersService
            .giveUsersPage(req.query.sortBy,
                req.query.sortDirection,
                req.query.pageNumber,
                req.query.pageSize,
                req.query.searchLoginTerm,
                req.query.searchEmailTerm)

        if (!pageWithUsers) {
            return res.sendStatus(404)
        }

        return res.status(200).send(pageWithUsers)
    }

    async createUser(req: RequestWithBody<CreateNewUser>, res: Response) {
        const newUser = await this.usersService.createNewUser(req.body.login, req.body.password, req.body.email)

        if (!newUser) {
            return res.sendStatus(404)
        }

        return res.status(201).send(newUser)
    }

    async deleteUserById(req: RequestWithParams<URIParameters>, res: Response) {
        const isDeleted = await this.usersService.deleteUserById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
}