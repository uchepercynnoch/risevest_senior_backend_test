import { Request, Response, Router } from 'express';
import errorAsyncWrapperMiddleware from '../common/middleware/error-async-wrapper.middleware';
import CommentService from '../comment/comment.service';
import CommentRepository from '../comment/comment.repository';
import CommentDto from '../comment/comment.dto';
import { createCommentValidationSchema } from '../common/validation';
import { ResponseDto } from '../common/dto';

export default function postController(router: Router) {
  const commentService = new CommentService(new CommentRepository());

  const addComment = errorAsyncWrapperMiddleware(async (req: Request, res: Response) => {
    const body = req.body as CommentDto;

    const { error } = createCommentValidationSchema(body);

    if (error) throw new Error(error.details[0].message);

    body.postId = parseInt(req.params.postId);

    await commentService.create(body);

    res.status(201).json(new ResponseDto<CommentDto>(201, 'Comment added', req.originalUrl, undefined, body));
  });

  router.post('/:postId/comments', addComment);

  return router;
}
