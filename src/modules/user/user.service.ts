import { Dao } from '../common/dao';
import UserModel from './user.model';
import UserDto from './user.dto';
import UserRepository from './user.repository';
import { QueryResult } from 'pg';

export default class UserService implements Dao<UserModel, UserDto> {
  constructor(private userRepository: UserRepository) {}

  async findTopThreeUsersWithMostPostAndLatestComments(limit: number) {
    const result: QueryResult<UserDto> = await this.userRepository.pool.query(`
        SELECT users.id, users.name, posts.title, comments.content
        FROM users
                 JOIN posts ON users.id = posts.userId
                 JOIN comments ON posts.id = comments.postId
        WHERE comments.createdAt IN
              (SELECT MAX(createdAt) FROM comments WHERE postId = posts.id)
        ORDER BY (SELECT COUNT(posts.id) FROM posts WHERE posts.userId = users.id) DESC
        LIMIT ${limit}`);

    return result.rows;
  }

  async create(value: UserDto): Promise<void> {
    const nameExist = await this.findOne({ name: value.name });

    if (nameExist) throw new Error(`Name ${value.name} already exist`);

    await this.userRepository.save(
      `INSERT INTO users(name)
       VALUES ($1)`,
      [value.name]
    );
  }

  findAll(): Promise<UserModel[]> {
    return this.userRepository.findAll('SELECT * FROM users', []);
  }

  async findOne(queryBy: any): Promise<UserModel> {
    return this.userRepository.findOne(
      `SELECT *
       FROM users
       WHERE id = ($1)
          OR name = ($2)`,
      [queryBy?.id, queryBy?.name]
    );
  }
}
