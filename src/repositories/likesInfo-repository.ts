import {LikesInfoScheme} from "../schemes/likeInfo-scheme";

export class LikesInfoRepository {
    // async removeLike(commentId: string) {
    //     return LikesInfoScheme.updateOne({commentId}, {likesCount: {$inc: -1}})
    // }
    //
    // async removeDislike(commentId: string) {
    //     return LikesInfoScheme.updateOne({commentId}, {dislikesCount: {$inc: -1}})
    // }

    async removeLikeOrDislike(commentId: string, field: string) {
        return LikesInfoScheme.updateOne({commentId},{field: {$inc: -1}})
    }

    async updateLikeOrDislikeCount(commentId: string, field: string) {
        return LikesInfoScheme.updateOne({commentId},{field: {$inc: 1}})
    }
}