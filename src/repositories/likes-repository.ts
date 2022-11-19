import {LikesScheme} from "../schemes/likes-scheme";

export class LikesRepository {
    async giveUserReaction(parentId: string, userId: string) {
        try {
            return LikesScheme.findOne({parentId, userId}, {_id: false, parentId: false, userId: false, __v: false}).lean()
        } catch (e) {
            return null
        }
    }

    async giveReactionsCount(commentId: string, status: string): Promise<number> {
        return LikesScheme.countDocuments({$and: [{commentId}, {status}]})
    }

    async getLikeReactionsCount(parentId: string): Promise<number> {
        return LikesScheme.countDocuments({parentId, status: 'Like'})
    }
    async getDislikeReactionsCount(parentId: string): Promise<number> {
        return LikesScheme.countDocuments({parentId, status: 'Dislike'})
    }

    async updateUserReaction(commentId: string, userId: string, status: string): Promise<boolean> {
        try{
            await LikesScheme.updateOne({parentId: commentId, userId},
                {$set: {status}},
                {upsert: true}
            )
            return  true
        } catch (e) {
            return  false
        }
    }

    async deleteAll(): Promise<boolean> {
        try {
            await LikesScheme.deleteMany({})
            return true
        } catch (e) {
            console.log('SecurityScheme => deleteAll =>', e)
            return false
        }
    }
}