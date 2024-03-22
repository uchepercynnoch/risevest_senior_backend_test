import { Dao } from '../common/dao';
import PostModel from './post.model';
import PostDto from './post.dto';
import PostRepository from './post.repository';

export default class PostService implements Dao<PostModel, PostDto> {
  constructor(private postRepository: PostRepository) {}

  async create(value: PostDto): Promise<void> {
    const titleExist = await this.findOne({ title: value.title });

    if (titleExist) throw new Error(`Title ${value.title} already exist`);

    await this.postRepository.save(
      `INSERT INTO posts(userid, title)
       VALUES ($1, $2)`,
      [value.userId, value.title]
    );
  }

  findAll(queryBy?: any): Promise<PostModel[]> {
    return this.postRepository.findAll('SELECT * FROM posts WHERE userid=($1)', [queryBy?.userId]);
  }

  async findOne(queryBy: any): Promise<PostModel> {
    return this.postRepository.findOne(
      `SELECT *
       FROM posts
       WHERE userid = ($1)
          OR id = ($2)
          OR title = ($3)`,
      [queryBy?.userId, queryBy?.id, queryBy?.title]
    );
  }
}
