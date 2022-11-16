import {UserDBConstructor} from "../types/user-constructor";

export const userDBtoUser = (userDB: UserDBConstructor) => {
    return {
        email: userDB.email,
        login: userDB.login,
        userId: userDB.id,
    }
}

export const usersOutputType = (accountData: UserDBConstructor) => {
    return {
        id: accountData.id,
        login: accountData.login,
        email: accountData.email,
        createdAt: accountData.createdAt
    }
}