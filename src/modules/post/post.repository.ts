import { SqlRepository } from '../common/dao';
import PostModel from './post.model';
import { sqlClient } from '../core/config/database.config';
import { QueryResult } from 'pg';

export default class PostRepository extends SqlRepository<PostModel> {
  constructor() {
    super();
    this.pool = sqlClient();
  }

  public async save(query: string, values: any[]): Promise<void> {
    try {
      await this.pool.query(query, values);
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async findOne(query: string, values: any[]): Promise<PostModel> {
    const result: QueryResult<PostModel> = await this.pool.query(query, values);

    return result.rows[0];
  }

  public async findAll(query: string, values: any[]): Promise<PostModel[]> {
    const result: QueryResult<PostModel> = await this.pool.query(query, values);

    return result.rows;
  }
}
