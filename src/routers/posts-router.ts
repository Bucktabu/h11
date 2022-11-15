import {Router} from "express";
import {createCommentForPostsRouterMiddleware,
        postsRouterMiddleware,
        getPostsRouterMiddleware,
        deletePostsRouterMiddleware} from "../middlewares/postsRouter-middleware";
import {postController} from "../composition-root";

export const postsRouter = Router({})


postsRouter.get('/',
    ...getPostsRouterMiddleware,postController.getPostsPage.bind(postController))

postsRouter.get('/:id', postController.getPostByPostId.bind(postController))

postsRouter.get('/:id/comments',
    ...getPostsRouterMiddleware, postController.getCommentsPageByPostId.bind(postController))

postsRouter.post('/',
    postsRouterMiddleware, postController.createPost.bind(postController))

postsRouter.post('/:id/comments',
    createCommentForPostsRouterMiddleware, postController.createCommentByPostId.bind(postController))

postsRouter.put('/:id',
    postsRouterMiddleware, postController.updatePostByPostId.bind(postController))

postsRouter.delete('/:id',
    deletePostsRouterMiddleware, postController.deletePostByPostId.bind(postController))