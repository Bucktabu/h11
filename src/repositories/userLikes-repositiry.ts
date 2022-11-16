import {UserLikesScheme} from "../schemes/userlikes-scheme";
import {LikesInfoScheme} from "../schemes/likeInfo-scheme";

export class UserLikesRepository {
    async giveUserLike(userId: string, commentId: string) {
        return UserLikesScheme
            .findOne({$and: [{userId}, {commentId}]})
    }

    async addUserReact(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        try {
            await UserLikesScheme.create({userId, commentId, likeStatus})
            return true
        } catch (e) {
            return false
        }
    }

    async updateUserLikeStatus(userId: string, likeStatus: string) {
        const result = await UserLikesScheme
            .updateOne({userId}, {$set: {myStatus: likeStatus}})

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