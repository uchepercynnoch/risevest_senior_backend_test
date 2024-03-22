import * as fs from 'fs/promises';
import path from 'node:path';
import { sqlClient } from '../config/database.config';
import { createFakeCommentsFactory, createFakePostsFactory, createFakeUsersFactory } from '../../../../test/__mocks__';
import PostRepository from '../../post/post.repository';
import UserRepository from '../../user/user.repository';
import CommentRepository from '../../comment/comment.repository';

export default class CommandLineRunner {
  private static readonly userRepository: UserRepository = new UserRepository();
  private static readonly postRepository: PostRepository = new PostRepository();
  private static readonly commentRepository: CommentRepository = new CommentRepository();

  public static async preload() {
    try {
      await this.loadFakeUsers();
      await this.loadFakePosts();
      await this.loadFakeComments();
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public static async up() {
    try {
      await this.createTables();
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public static async down() {
    try {
      await this.dropTables();
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public static async truncate() {
    try {
      await this.truncateTables();
    } catch (e: any) {
      throw new Error(e);
    }
  }

  private static async createTables() {
    const sqlDataFile = await fs.readFile(path.resolve(__dirname, '../../../resources/db/create-tables.sql'));

    const pool = sqlClient();

    await pool.query(sqlDataFile.toString('utf-8'));

    await pool.end();
  }

  private static async dropTables() {
    const sqlDataFile = await fs.readFile(path.resolve(__dirname, '../../../resources/db/drop-tables.sql'));

    const pool = sqlClient();

    await pool.query(sqlDataFile.toString('utf-8'));

    await pool.end();
  }

  private static async truncateTables() {
    const sqlDataFile = await fs.readFile(path.resolve(__dirname, '../../../resources/db/truncate-tables.sql'));

    const pool = sqlClient();

    await pool.query(sqlDataFile.toString('utf-8'));

    await pool.end();
  }

  private static async loadFakeUsers() {
    const users = await this.userRepository.findAll(
      `
          SELECT *
          FROM users`,
      []
    );

    if (users.length) return;

    const usersFactory = createFakeUsersFactory(3);

    for (const userDto of usersFactory) {
      await this.userRepository.save(
        `
            INSERT INTO users(name)
            values ($1)`,
        [userDto.name]
      );
    }
  }

  private static async loadFakePosts() {
    const posts = await this.postRepository.findAll(
      `
          SELECT *
          FROM posts`,
      []
    );

    if (posts.length) return;

    const user1Posts = createFakePostsFactory(4, 1);
    for (const { userId, title } of user1Posts) {
      await this.postRepository.save(
        `
            INSERT INTO posts(userid, title)
            VALUES ($1, $2) `,
        [userId, title]
      );
    }

    const user2Posts = createFakePostsFactory(2, 2);
    for (const { userId, title } of user2Posts) {
      await this.postRepository.save(
        `
            INSERT INTO posts(userid, title)
            VALUES ($1, $2) `,
        [userId, title]
      );
    }

    const user3Posts = createFakePostsFactory(1, 3);
    for (const { userId, title } of user3Posts) {
      await this.postRepository.save(
        `
            INSERT INTO posts(userid, title)
            VALUES ($1, $2) `,
        [userId, title]
      );
    }
  }

  private static async loadFakeComments() {
    const comments = await this.commentRepository.findAll(
      `
          SELECT *
          FROM comments`,
      []
    );

    if (comments.length) return;

    const post1Comments = createFakeCommentsFactory(6, 1);
    for (const { postId, content } of post1Comments) {
      await this.commentRepository.save(
        `
            INSERT INTO comments(postid, content, createdat)
            VALUES ($1, $2, $3)`,
        [postId, content, new Date()]
      );
    }

    const post2Comments = createFakeCommentsFactory(5, 2);
    for (const { postId, content } of post2Comments) {
      await this.commentRepository.save(
        `
            INSERT INTO comments(postid, content, createdat)
            VALUES ($1, $2, $3)`,
        [postId, content, new Date()]
      );
    }

    const post3Comments = createFakeCommentsFactory(4, 3);
    for (const { postId, content } of post3Comments) {
      await this.commentRepository.save(
        `
            INSERT INTO comments(postid, content, createdat)
            VALUES ($1, $2, $3)`,
        [postId, content, new Date()]
      );
    }

    const post4Comments = createFakeCommentsFactory(3, 4);
    for (const { postId, content } of post4Comments) {
      await this.commentRepository.save(
        `
            INSERT INTO comments(postid, content, createdat)
            VALUES ($1, $2, $3)`,
        [postId, content, new Date()]
      );
    }

    const post5Comments = createFakeCommentsFactory(2, 5);
    for (const { postId, content } of post5Comments) {
      await this.commentRepository.save(
        `
            INSERT INTO comments(postid, content, createdat)
            VALUES ($1, $2, $3)`,
        [postId, content, new Date()]
      );
    }

    const post6Comments = createFakeCommentsFactory(1, 6);
    for (const { postId, content } of post6Comments) {
      await this.commentRepository.save(
        `
            INSERT INTO comments(postid, content, createdat)
            VALUES ($1, $2, $3)`,
        [postId, content, new Date()]
      );
    }

    const post7Comments = createFakeCommentsFactory(5, 7);
    for (const { postId, content } of post7Comments) {
      await this.commentRepository.save(
        `
            INSERT INTO comments(postid, content, createdat)
            VALUES ($1, $2, $3)`,
        [postId, content, new Date()]
      );
    }
  }
}
