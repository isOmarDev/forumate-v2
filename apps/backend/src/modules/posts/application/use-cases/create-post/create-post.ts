import { CreatePostCommand } from '@forumate/api/posts';
import { type IEventBus } from '@forumate/bus';
import { Result, type IUseCase } from '@forumate/core';
import { NotFoundError, ValidationError } from '@forumate/errors/application';

import { type IMembersRepository } from '../../../../members/repos/ports/members-repository';
import { Post } from '../../../domain/entities/post';
import { CanCreatePostPolicy } from '../../../domain/policies/can-create-post';
import { type IPostsRepository } from '../../../repos/ports/posts-repository';

type CreatePostError = ValidationError | NotFoundError;

export type CreatePostResponse = Result<Post, CreatePostError>;

export class CreatePost implements IUseCase<
  CreatePostCommand,
  CreatePostResponse
> {
  constructor(
    private postRepository: IPostsRepository,
    private memberRepository: IMembersRepository,
    private eventBus: IEventBus,
  ) {}

  async execute(request: CreatePostCommand): Promise<CreatePostResponse> {
    // Implement!
    throw new Error('To be implemented');
  }
}
