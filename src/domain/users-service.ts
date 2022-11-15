import bcrypt from 'bcrypt'
import {authService} from "./auth-service";
import {usersRepository} from "../repositories/users-repository";
import {AboutMeConstructor} from "../types/aboutMe-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {UserDBConstructor, UserConstructor} from "../types/user-constructor";
import {paginationContentPage} from "../paginationContentPage";
import {_generateHash} from "../helperFunctions";
import {userDBtoUser, usersOutputType} from "../dataMapping/toUserOutputType";

export class UsersService {
    async aboutMe(user: UserDBConstructor): Promise<AboutMeConstructor> {
        return userDBtoUser(user)
    }

    async createNewUser(login: string, password: string, email: string): Promise<UserConstructor | null> {
        const userAccount = await authService.createUser(login, password, email)
        return usersOutputType(userAccount!.accountData)
    }

    async giveUserById(id: string): Promise<UserDBConstructor | null> {
        return usersRepository.giveUserById(id)
    }

    async giveUsersPage(sortBy: string,
                        sortDirection: string,
                        pageNumber: string,
                        pageSize: string,
                        searchLoginTerm: string,
                        searchEmailTerm: string): Promise<ContentPageConstructor> {

        const users = await usersRepository.giveUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
        const totalCount = await usersRepository.giveTotalCount(searchLoginTerm, searchEmailTerm)

        return paginationContentPage(pageNumber, pageSize, users, totalCount)
    }

    async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await _generateHash(newPassword, passwordSalt) //TODO вынести в отдельную функцию

        return await usersRepository.updateUserPassword(userId, passwordSalt, passwordHash)
    }

    async deleteUserById(userId: string): Promise<boolean> {
        return await usersRepository.deleteUserById(userId)
    }
}

export const usersService = new UsersService()