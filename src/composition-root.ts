import {BlogsRepository} from "./repositories/blogs-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {EmailConfirmationRepository} from "./repositories/emailConfirmation-repository";
import {IpAddressRepository} from "./repositories/ipAddress-repository";
import {JWTBlackList} from "./repositories/jwtBlackList";
import {LikesInfoRepository} from "./repositories/likesInfo-repository";
import {PostsRepository} from "./repositories/posts-repository";
import {SecurityRepository} from "./repositories/security-repository";
import {UserLikesRepository} from "./repositories/userLikes-repositiry";
import {UsersRepository} from "./repositories/users-repository";
import {AuthService} from "./domain/auth-service";
import {BlogsService} from "./domain/blogs-service";
import {CommentsService} from "./domain/comments-servise";
import {PostsService} from "./domain/posts-service";
import {SecurityService} from "./domain/security-service";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./controllers/users-controller";
import {AuthController} from "./controllers/auth-controller";
import {BlogsController} from "./controllers/blogs-controller";
import {CommentsController} from "./controllers/comments-controller";
import {PostsController} from "./controllers/posts-controller";
import {SecurityController} from "./controllers/security-controller";
import {TestingController} from "./controllers/testing-controller";
import {JWTService} from "./application/jws-service";

export const blogsRepository = new BlogsRepository()
const commentsRepository = new CommentsRepository()
export const emailConfirmationRepository = new EmailConfirmationRepository()
const ipAddressRepository = new IpAddressRepository()
const jwtBlackList = new JWTBlackList()
export const likesInfoRepository = new LikesInfoRepository()
const postsRepository = new PostsRepository()
const securityRepository = new SecurityRepository()
export const userLikesRepository = new UserLikesRepository()
export const usersRepository = new UsersRepository()

const authService = new AuthService(usersRepository)
const blogsService = new BlogsService(blogsRepository)
export const jwtService = new JWTService(jwtBlackList)
export const commentsService = new CommentsService(
    jwtService,
    commentsRepository,
    likesInfoRepository,
    userLikesRepository)
const postsService = new PostsService(postsRepository, blogsRepository)
export const securityService = new SecurityService(
    jwtService,
    securityRepository)
export const usersService = new UsersService(usersRepository, authService)

export const authController = new AuthController(
    authService,
    jwtService,
    securityService,
    usersService)
export const blogsController = new BlogsController(blogsService, postsService)
export const commentController = new CommentsController(commentsService, jwtService, usersService)
export const postController = new PostsController(postsService, commentsService)
export const securityController = new SecurityController(securityService)
export const testingController = new TestingController(
    blogsRepository,
    commentsRepository,
    emailConfirmationRepository,
    ipAddressRepository,
    jwtBlackList,
    likesInfoRepository,
    postsRepository,
    securityRepository,
    userLikesRepository,
    usersRepository)
export const userController = new UsersController(usersService)



