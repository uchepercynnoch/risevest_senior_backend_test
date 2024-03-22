import { SqlRepository } from '../common/dao';
import CommentModel from './comment.model';
import { sqlClient } from '../core/config/database.config';
import { QueryResult } from 'pg';

export default class CommentRepository extends SqlRepository<CommentModel> {
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

  public async findOne(query: string, values: any[]): Promise<CommentModel> {
    const result: QueryResult<CommentModel> = await this.pool.query(query, values);

    return result.rows[0];
  }

  public async findAll(query: string, values: any[]): Promise<CommentModel[]> {
    const result: QueryResult<CommentModel> = await this.pool.query(query, values);

    return result.rows;
  }
}
