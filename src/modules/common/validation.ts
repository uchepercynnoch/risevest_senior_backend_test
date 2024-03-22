import Joi from 'joi';
import UserDto from '../user/user.dto';
import PostDto from '../post/post.dto';
import CommentDto from '../comment/comment.dto';

export const createUserValidationSchema = (dto: UserDto) => {
  return Joi.object<UserDto>({
    id: Joi.number().allow(null).label('User Id'),
    name: Joi.string().required().label('Name'),
  }).validate(dto);
};

export const createPostValidationSchema = (dto: PostDto) => {
  return Joi.object<PostDto>({
    id: Joi.number().allow(null).label('Post Id'),
    title: Joi.string().required().label('Title'),
  }).validate(dto);
};

export const createCommentValidationSchema = (dto: CommentDto) => {
  return Joi.object<CommentDto>({
    id: Joi.number().allow(null).label('Comment Id'),
    content: Joi.string().required().label('Content'),
  }).validate(dto);
};
