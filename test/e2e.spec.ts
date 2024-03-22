import 'dotenv/config';
import http, { Server } from 'http';
import UserDto from '../src/modules/user/user.dto';
import envConfig from '../src/modules/core/config/env.config';
import app from '../src/modules/core/app';
import CommandLineRunner from '../src/modules/core/system/command-line.runner';
import supertest, { SuperTest, Test } from 'supertest';
import {
  AUTH_TOKEN,
  BAD_REQUEST_CODE,
  createFakeCommentsFactory,
  createFakePostsFactory,
  createFakeUsersFactory,
  fakeGetRequest,
  fakePostRequest,
  OK_CODE,
  UNAUTHORIZED_CODE,
  UNAUTHORIZED_VALUE,
} from './__mocks__';
import PostDto from '../src/modules/post/post.dto';
import CommentDto from '../src/modules/comment/comment.dto';

describe('UsersModule', () => {
  let server: Server;
  let fakeUsers: UserDto[];
  let fakePosts: PostDto[];
  let fakeComments: CommentDto[];
  let api: SuperTest<Test>;

  beforeAll(async () => {
    await CommandLineRunner.up();
    const PORT = envConfig().service.port;

    fakeUsers = createFakeUsersFactory(2);
    fakePosts = createFakePostsFactory(1, 1);
    fakeComments = createFakeCommentsFactory(1, 1);
    server = http.createServer(app);
    api = supertest(app);

    server.listen(PORT);
  });

  afterAll(async () => {
    await CommandLineRunner.down();
    server.close();
  });

  describe('User', () => {
    describe('/POST create {/users}', () => {
      afterEach(async () => {
        await CommandLineRunner.truncate();
      });

      it('should fail with error 401 given no authentication token when user data is provided', async () => {
        const userDto = fakeUsers[0];

        const responseDto = await fakePostRequest<UserDto, UserDto>(userDto, '/users')(api);

        expect(responseDto).toHaveProperty('statusCode', UNAUTHORIZED_CODE);
        expect(responseDto).toHaveProperty('message', UNAUTHORIZED_VALUE);
      });

      it('should fail with error 400 given authentication token when user data is invalid', async () => {
        const userDto = fakeUsers[0];

        const invalidDto = Object.assign({}, userDto);
        invalidDto.name = '';

        const resDto = await fakePostRequest<UserDto, UserDto>(invalidDto, '/users')(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', BAD_REQUEST_CODE);
        expect(resDto).toHaveProperty('message', '"Name" is not allowed to be empty');
      });

      it('should fail with error 400 given authentication token when user data already exist', async () => {
        const userDto = fakeUsers[0];
        await fakePostRequest<UserDto, UserDto>(userDto, '/users')(api, AUTH_TOKEN);

        const resDto = await fakePostRequest<UserDto, UserDto>(userDto, '/users')(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', BAD_REQUEST_CODE);
        expect(resDto).toHaveProperty('message', `Name ${userDto.name} already exist`);
      });

      it('should succeed with 200 given authentication token when user data is valid', async () => {
        const userDto = fakeUsers[0];

        const resDto = await fakePostRequest<UserDto, UserDto>(userDto, '/users')(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', OK_CODE);
        expect(resDto).toHaveProperty('message', `User created`);
        expect(resDto).toHaveProperty('result', expect.objectContaining(userDto));
      });
    });

    describe('/GET get {/users}', () => {
      afterEach(async () => {
        await CommandLineRunner.truncate();
      });

      it('should fail with error 401 given no authentication token when user data is provided', async () => {
        const responseDto = await fakeGetRequest<UserDto>('/users')(api);

        expect(responseDto).toHaveProperty('statusCode', UNAUTHORIZED_CODE);
        expect(responseDto).toHaveProperty('message', UNAUTHORIZED_VALUE);
      });

      it('should succeed with 200 given authentication token when no users', async () => {
        const resDto = await fakeGetRequest<UserDto>('/users')(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', OK_CODE);
        expect(resDto).toHaveProperty('message', 'Ok');
        expect(resDto).toHaveProperty('results', expect.arrayContaining([]));
      });

      it('should succeed with 200 given authentication token when 2 users exist', async () => {
        for (const fakeUser of fakeUsers) {
          await fakePostRequest<UserDto, UserDto>(fakeUser, '/users')(api, AUTH_TOKEN);
        }

        const resDto = await fakeGetRequest<UserDto>('/users')(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', OK_CODE);
        expect(resDto).toHaveProperty('message', 'Ok');
        expect(resDto).toHaveProperty('results', expect.arrayContaining(fakeUsers));
      });

      it('should return 200 and top 3 users with most posts and latest comments given authentication', async () => {
        await CommandLineRunner.preload();

        const resDto = await fakeGetRequest<UserDto>('/users/?limit=3')(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', OK_CODE);
        expect(resDto).toHaveProperty('message', 'Ok');
        expect(resDto?.results?.length).toEqual(3);
      });
    });

    describe('/POST create {/users/:id/posts}', () => {
      beforeEach(async () => {
        await fakePostRequest<UserDto, UserDto>(fakeUsers[0], '/users')(api, AUTH_TOKEN);
      });

      afterEach(async () => {
        await CommandLineRunner.truncate();
      });

      it('should fail with error 401 given no authentication token when post data is provided', async () => {
        const postDto = fakePosts[0];

        const responseDto = await fakePostRequest<PostDto, PostDto>(postDto, `/users/${1}/posts`)(api);

        expect(responseDto).toHaveProperty('statusCode', UNAUTHORIZED_CODE);
        expect(responseDto).toHaveProperty('message', UNAUTHORIZED_VALUE);
      });

      it('should fail with error 400 given authentication token when post data is invalid', async () => {
        const postDto = fakePosts[0];

        const invalidDto = Object.assign({}, postDto);
        invalidDto.title = '';

        const resDto = await fakePostRequest<PostDto, PostDto>(invalidDto, `/users/${1}/posts`)(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', BAD_REQUEST_CODE);
        expect(resDto).toHaveProperty('message', '"Title" is not allowed to be empty');
      });

      it('should fail with error 400 given authentication token when post data already exist', async () => {
        const postDto = fakePosts[0];
        const data = { title: postDto.title };

        await fakePostRequest<PostDto, PostDto>(data, `/users/${1}/posts`)(api, AUTH_TOKEN);

        const resDto = await fakePostRequest<PostDto, PostDto>(data, `/users/${1}/posts`)(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', BAD_REQUEST_CODE);
        expect(resDto).toHaveProperty('message', `Title ${postDto.title} already exist`);
      });

      it('should succeed with 200 given authentication token when post data is valid', async () => {
        const postDto = fakePosts[0];
        const data = { title: postDto.title };

        const resDto = await fakePostRequest<PostDto, PostDto>(data, `/users/${1}/posts`)(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', OK_CODE);
        expect(resDto).toHaveProperty('message', `Post created`);
        expect(resDto).toHaveProperty(
          'result',
          expect.objectContaining({
            userId: postDto.userId,
            title: postDto.title,
          })
        );
      });
    });

    describe('/GET get {/users/:id/posts}', () => {
      beforeEach(async () => {
        await fakePostRequest<UserDto, UserDto>(fakeUsers[0], '/users')(api, AUTH_TOKEN);
      });

      afterEach(async () => {
        await CommandLineRunner.truncate();
      });

      it('should fail with error 401 given no authentication token when post data is provided', async () => {
        const responseDto = await fakeGetRequest<PostDto>(`/users/${1}/posts`)(api);

        expect(responseDto).toHaveProperty('statusCode', UNAUTHORIZED_CODE);
        expect(responseDto).toHaveProperty('message', UNAUTHORIZED_VALUE);
      });

      it('should succeed with 200 given authentication token when no posts', async () => {
        const resDto = await fakeGetRequest<PostDto>(`/users/${1}/posts`)(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', OK_CODE);
        expect(resDto).toHaveProperty('message', 'Ok');
        expect(resDto).toHaveProperty('results', expect.arrayContaining([]));
      });

      it('should succeed with 200 given authentication token when 2 posts exist', async () => {
        const postDto = fakePosts[0];
        const data = { title: postDto.title };

        await fakePostRequest<PostDto, PostDto>(data, `/users/${1}/posts`)(api, AUTH_TOKEN);

        const resDto = await fakeGetRequest<PostDto>(`/users/${1}/posts`)(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', OK_CODE);
        expect(resDto).toHaveProperty('message', 'Ok');
        expect(resDto).toHaveProperty(
          'results',
          expect.arrayContaining([
            expect.objectContaining({
              id: postDto.id,
              userid: postDto.userId,
              title: postDto.title,
            }),
          ])
        );
      });
    });
  });

  describe('Post', () => {
    describe('/POST create {/posts/:postId/comments}', () => {
      beforeEach(async () => {
        await fakePostRequest<UserDto, UserDto>(fakeUsers[0], '/users')(api, AUTH_TOKEN);

        const postDto = fakePosts[0];
        const data = { title: postDto.title };
        await fakePostRequest<PostDto, PostDto>(data, `/users/${1}/posts`)(api, AUTH_TOKEN);
      });

      afterEach(async () => {
        await CommandLineRunner.truncate();
      });

      it('should fail with error 401 given no authentication token when comment data is provided', async () => {
        const commentDto = fakeComments[0];

        const responseDto = await fakePostRequest<CommentDto, CommentDto>(commentDto, `/posts/${1}/comments`)(api);

        expect(responseDto).toHaveProperty('statusCode', UNAUTHORIZED_CODE);
        expect(responseDto).toHaveProperty('message', UNAUTHORIZED_VALUE);
      });

      it('should succeed with 200 given authentication token when comment data is valid', async () => {
        const commentDto = fakeComments[0];
        const data = { content: commentDto.content };

        const resDto = await fakePostRequest<CommentDto, CommentDto>(data, `/posts/${1}/comments`)(api, AUTH_TOKEN);

        expect(resDto).toHaveProperty('statusCode', OK_CODE);
        expect(resDto).toHaveProperty('message', `Comment added`);
        expect(resDto).toHaveProperty(
          'result',
          expect.objectContaining({
            content: commentDto.content,
            postId: commentDto.postId,
          })
        );
      });
    });
  });
});
