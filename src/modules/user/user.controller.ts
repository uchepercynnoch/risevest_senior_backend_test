import { Request, Response, Router } from 'express';
import UserService from './user.service';
import UserRepository from './user.repository';
import errorAsyncWrapperMiddleware from '../common/middleware/error-async-wrapper.middleware';
import UserDto from './user.dto';
import { ResponseDto } from '../common/dto';
import PostService from '../post/post.service';
import PostRepository from '../post/post.repository';
import PostDto from '../post/post.dto';
import { createPostValidationSchema, createUserValidationSchema } from '../common/validation';
import UserModel from './user.model';

export default function userController(router: Router) {
  const userService = new UserService(new UserRepository());
  const postService = new PostService(new PostRepository());

  const findUsers = errorAsyncWrapperMiddleware(async (req: Request, res: Response) => {
    let users: UserModel[];

    if (req.query?.limit) {
      users = await userService.findTopThreeUsersWithMostPostAndLatestComments(3);
    } else users = await userService.findAll();

    res.status(200).json(new ResponseDto<UserDto>(200, 'Ok', req.originalUrl, users));
  });

  const createUser = errorAsyncWrapperMiddleware(async (req: Request, res: Response) => {
    const body = req.body as UserDto;

    const { error } = createUserValidationSchema(body);

    if (error) throw new Error(error.details[0].message);

    await userService.create(body);

    res.status(201).json(new ResponseDto<UserDto>(201, 'User created', req.originalUrl, undefined, body));
  });

  const createPost = errorAsyncWrapperMiddleware(async (req: Request, res: Response) => {
    const body = req.body as PostDto;

    const { error } = createPostValidationSchema(body);

    if (error) throw new Error(error.details[0].message);

    body.userId = parseInt(req.params.id);

    await postService.create(body);

    res.status(201).json(new ResponseDto<PostDto>(201, 'Post created', req.originalUrl, undefined, body));
  });

  const findPosts = errorAsyncWrapperMiddleware(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    const posts = await postService.findAll({ userId });

    res.status(200).json(new ResponseDto<PostDto>(200, 'Ok', req.originalUrl, posts));
  });

  router.get('', findUsers);
  router.post('', createUser);
  router.get('/:id/posts', findPosts);
  router.post('/:id/posts', createPost);

  return router;
}
