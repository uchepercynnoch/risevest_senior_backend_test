import { Pool } from 'pg';

export interface Dao<T, V> {
  create(value: V): Promise<void>;

  findAll(queryBy?: any): Promise<T[]>;

  findOne(queryBy: any): Promise<T>;
}

export abstract class SqlRepository<T> {
  private declare _pool: Pool;

  get pool(): Pool {
    return this._pool;
  }

  set pool(value: Pool) {
    this._pool = value;
  }

  public abstract save(query: string, values: any[]): Promise<void>;

  public abstract findOne(query: string, values: any[]): Promise<T>;

  public abstract findAll(query: string, values: any[]): Promise<T[]>;
}
