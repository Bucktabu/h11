import {LikesScheme} from "../schemes/likes-scheme";

export class LikesRepository {
    async giveUserReaction(commentId: string, userId: string) {
        try {
            return LikesScheme.findOne(
                {$and: [{parentId: commentId}, {userId}]},
                {projection: {_id: false, parentId: false, userId: false, __v: false}})
        } catch (e) {
            return null
        }
    }

    async giveReactionsCount(commentId: string, status: string): Promise<number> {
        return LikesScheme.countDocuments({$and: [{commentId}, {status}]})
    }

    async updateUserReaction(commentId: string, userId: string, status: string): Promise<boolean> {
        const result = await LikesScheme.updateOne({
            $and: [{parentId: commentId}, {userId}]},
            {$set: {status}},
            {upsert: true}
        )

        return result.matchedCount === 1
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