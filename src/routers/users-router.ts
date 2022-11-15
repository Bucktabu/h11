import {Router} from "express";
import {deleteUsersRouter,
        getUsersRouterMiddleware,
        postUsersRouterMiddleware} from "../middlewares/usersRouter-middleware";
import {userController} from "../composition-root";

export const usersRouter = Router({})

usersRouter.post('/',
    ...postUsersRouterMiddleware, userController.createUser.bind(userController))

usersRouter.get('/',
    ...getUsersRouterMiddleware, userController.getUsersPage.bind(userController))

usersRouter.delete('/:id',
    ...deleteUsersRouter, userController.deleteUserById.bind(userController))