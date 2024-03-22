import UserDto from '../../src/modules/user/user.dto';
import { faker } from '@faker-js/faker';
import PostDto from '../../src/modules/post/post.dto';
import CommentDto from '../../src/modules/comment/comment.dto';
import { SuperTest, Test } from 'supertest';
import { ResponseDto } from '../../src/modules/common/dto';
import envConfig from '../../src/modules/core/config/env.config';

export const API_ROOT = envConfig().service.apiRoot;
export const AUTH_TOKEN = process.env.BEARER_TOKEN;
export const UNAUTHORIZED_CODE = 401;
export const UNAUTHORIZED_VALUE = 'Unauthorized';
export const BAD_REQUEST_CODE = 400;
export const OK_CODE = 200;

export const createFakeUsersFactory = (count = 1) => {
  const users: UserDto[] = [];

  for (let i = 0; i < count; i++) {
    users[i] = {
      id: i + 1,
      name: faker.person.fullName(),
    };
  }

  return users;
};

export const createFakePostsFactory = (count = 1, userId: number) => {
  const posts: PostDto[] = [];

  for (let i = 0; i < count; i++) {
    posts[i] = {
      id: i + 1,
      userId,
      title: faker.lorem.words(5),
    };
  }

  return posts;
};

export const createFakeCommentsFactory = (count = 1, postId: number) => {
  const comments: CommentDto[] = [];

  for (let i = 0; i < count; i++) {
    comments[i] = {
      id: i + 1,
      postId,
      content: faker.lorem.paragraph(),
    };
  }

  return comments;
};

export const fakePostRequest = <T, V>(body: Partial<V>, endpoint: string) => {
  const url = `${API_ROOT}${endpoint}`;

  return async (api: SuperTest<Test>, jwt?: string): Promise<ResponseDto<T>> => {
    if (jwt) {
      const response = await api.post(url).set('Authorization', `Bearer ${jwt}`).send(body);

      return response.body;
    }

    const response = await api.post(url).send(body);

    return response.body;
  };
};

export const fakeGetRequest = <T>(endpoint: string) => {
  const url = `${API_ROOT}${endpoint}`;

  return async (api: SuperTest<Test>, jwt?: string): Promise<ResponseDto<T>> => {
    if (jwt) {
      const response = await api.get(url).set('Authorization', `Bearer ${jwt}`);

      return response.body;
    }

    const response = await api.get(url);

    return response.body;
  };
};

export const fakePutRequest = <T, V>(body: Partial<V>, endpoint: string) => {
  const url = `${API_ROOT}${endpoint}`;

  return async (api: SuperTest<Test>, jwt?: string): Promise<ResponseDto<T>> => {
    if (jwt) {
      const response = await api.put(url).set('Authorization', `Bearer ${jwt}`).send(body);

      return response.body;
    }

    const response = await api.put(url).send(body);

    return response.body;
  };
};
