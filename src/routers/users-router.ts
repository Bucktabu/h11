import {Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {CreateNewUser} from "../models/createNewUser";
import {QueryParameters} from "../models/queryParameters";
import {URIParameters} from "../models/URIParameters";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/request-types";
import {deleteUsersRouter,
        getUsersRouterMiddleware,
        postUsersRouterMiddleware} from "../middlewares/usersRouter-middleware";

export const usersRouter = Router({})

class UserController {
    async getUsersPage(req: RequestWithQuery<QueryParameters>, res: Response) {
        const pageWithUsers: ContentPageConstructor = await usersService
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
        const newUser = await usersService.createNewUser(req.body.login, req.body.password, req.body.email)

        if (!newUser) {
            return res.sendStatus(404)
        }

        return res.status(201).send(newUser)
    }

    async deleteUserById(req: RequestWithParams<URIParameters>, res: Response) {
        const isDeleted = await usersService.deleteUserById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
}

const userControllerInstance = new UserController()

usersRouter.post('/',
    ...postUsersRouterMiddleware, userControllerInstance.createUser.bind(userControllerInstance))

usersRouter.get('/',
    ...getUsersRouterMiddleware, userControllerInstance.getUsersPage.bind(userControllerInstance))

usersRouter.delete('/:id',
    ...deleteUsersRouter, userControllerInstance.deleteUserById.bind(userControllerInstance))