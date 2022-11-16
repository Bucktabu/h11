import bcrypt from 'bcrypt'
import {UsersRepository} from "../repositories/users-repository";
import {AboutMeConstructor} from "../types/aboutMe-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {UserDBConstructor, UserConstructor} from "../types/user-constructor";
import {paginationContentPage} from "../paginationContentPage";
import {_generateHash} from "../helperFunctions";
import {userDBtoUser, usersOutputType} from "../dataMapping/toUserOutputData";
import {AuthService} from "./auth-service";

export class UsersService {
    constructor(protected usersRepository: UsersRepository,
                protected authService: AuthService) {}

    async aboutMe(user: UserDBConstructor): Promise<AboutMeConstructor> {
        return userDBtoUser(user)
    }

    async createNewUser(login: string, password: string, email: string): Promise<UserConstructor | null> {
        const userAccount = await this.authService.createUser(login, password, email)
        return usersOutputType(userAccount!.accountData)
    }

    async giveUserByIdOrLoginOrEmail(IdOrLoginOrEmail: string): Promise<UserDBConstructor | null> {
        return this.usersRepository.giveUserByIdOrLoginOrEmail(IdOrLoginOrEmail)
    }

    async giveUsersPage(sortBy: string,
                        sortDirection: string,
                        pageNumber: string,
                        pageSize: string,
                        searchLoginTerm: string,
                        searchEmailTerm: string): Promise<ContentPageConstructor> {

        const users = await this.usersRepository.giveUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
        const totalCount = await this.usersRepository.giveTotalCount(searchLoginTerm, searchEmailTerm)

        return paginationContentPage(pageNumber, pageSize, users, totalCount)
    }

    async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await _generateHash(newPassword, passwordSalt) //TODO вынести в отдельную функцию

        return await this.usersRepository.updateUserPassword(userId, passwordSalt, passwordHash)
    }

    async deleteUserById(userId: string): Promise<boolean> {
        return await this.usersRepository.deleteUserById(userId)
    }
}