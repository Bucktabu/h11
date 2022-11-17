import {UserLikesScheme} from "../schemes/userlikes-scheme";
import {UserLikeStatusConstructor} from "../types/userLikeStatus-constructor";

export class UserLikesRepository {
    async giveUserLike(userId: string, commentId: string) {
        return UserLikesScheme
            .findOne({$and: [{userId}, {commentId}]})
    }

    async addUserReact(userReaction: UserLikeStatusConstructor): Promise<boolean> {
        try {
            await UserLikesScheme.create(userReaction)
            return true
        } catch (e) {
            return false
        }
    }

    async updateUserLikeStatus(userId: string, likeStatus: string): Promise<boolean> {
        const result = await UserLikesScheme
            .updateOne({userId}, {$set: {likeStatus}})

        return result.matchedCount === 1
    }

    async deleteAll(): Promise<boolean> {
        try {
            await UserLikesScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('UserLikesScheme => deleteAll =>', e)
            return false
        }
    }

}