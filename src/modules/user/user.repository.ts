import { SqlRepository } from '../common/dao';
import UserModel from './user.model';
import { sqlClient } from '../core/config/database.config';
import { QueryResult } from 'pg';

export default class UserRepository extends SqlRepository<UserModel> {
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

  public async findOne(query: string, values: any[]): Promise<UserModel> {
    const result: QueryResult<UserModel> = await this.pool.query(query, values);

    return result.rows[0];
  }

  public async findAll(query: string, values: any[]): Promise<UserModel[]> {
    const result: QueryResult<UserModel> = await this.pool.query(query, values);

    return result.rows;
  }
}
