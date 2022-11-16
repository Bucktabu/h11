import {LikesInfoScheme} from "../schemes/likeInfo-scheme";
import {TokenBlackListScheme} from "../schemes/tokenBlackList-scheme";

export class LikesInfoRepository {
    // async removeLike(commentId: string) {
    //     return LikesInfoScheme.updateOne({commentId}, {likesCount: {$inc: -1}})
    // }
    //
    // async removeDislike(commentId: string) {
    //     return LikesInfoScheme.updateOne({commentId}, {dislikesCount: {$inc: -1}})
    // }

    async giveLikeInfo(commentId: string) {
        return LikesInfoScheme.findOne({commentId}, {projection: {_id: false}})
    }

    async removeLikeOrDislike(commentId: string, field: string) {
        const result = await LikesInfoScheme
            .updateOne({commentId},{field: {$inc: -1}})

        return result.matchedCount === 1
    }

    async updateLikeOrDislikeCount(commentId: string, field: string) {
        const result = await LikesInfoScheme
            .updateOne({commentId},{field: {$inc: 1}})

        return result.matchedCount === 1
    }

    async deleteAll(): Promise<boolean> {
        try {
            await LikesInfoScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('LikesInfoScheme => deleteAll =>', e)
            return false
        }
    }
}