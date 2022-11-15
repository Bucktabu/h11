import {UserLikesScheme} from "../schemes/userlikes-scheme";

export class UserLikesRepository {
    async checkUserLike(userId: string, commentId: string) {
        return UserLikesScheme
            .findOne({$and: [{userId}, {commentId}]})
    }

    async addUserLike(userId: string, commentId: string, userStatus: string): Promise<boolean> {
        try {
            await UserLikesScheme.create({userId, commentId, userStatus})
            return true
        } catch (e) {
            return false
        }
    }

    async updateUserLikeStatus(userId: string, status: string) {

    }

}