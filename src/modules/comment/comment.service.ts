import { Dao } from '../common/dao';
import CommentModel from './comment.model';
import CommentDto from './comment.dto';
import CommentRepository from './comment.repository';

export default class CommentService implements Dao<CommentModel, CommentDto> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(value: CommentDto): Promise<void> {
    await this.commentRepository.save(
      `INSERT INTO comments(postid, content, createdat)
       VALUES ($1, $2, $3)`,
      [value.postId, value.content, new Date()]
    );
  }

  findAll(): Promise<CommentModel[]> {
    return this.commentRepository.findAll('SELECT * FROM comments', []);
  }

  async findOne(queryBy: any): Promise<CommentModel> {
    return this.commentRepository.findOne(
      `SELECT *
       FROM comments
       WHERE postid = ($1)
          OR id = ($2)`,
      [queryBy?.postId, queryBy?.id]
    );
  }
}
