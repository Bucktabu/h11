import {UserDB} from "../types/user";

export const userDBtoUser = (userDB: UserDB) => {
    return {
        email: userDB.email,
        login: userDB.login,
        userId: userDB.id,
    }
}

export const usersOutputType = (userDB: UserDB) => {
    return {
        id: userDB.id,
        login: userDB.login,
        email: userDB.email,
        createdAt: userDB.createdAt
    }
}