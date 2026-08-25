import { CreatePostCommand } from '@forumate/api/posts';
import { EventBus } from '@forumate/bus';
import { Result, UseCase } from '@forumate/core';
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from '@forumate/errors/application';
import { AnyServerError } from '@forumate/errors/server';

import { MembersRepository } from '../../../../members/repos/ports/members-repository';
import { Post } from '../../../domain/entities/post';
import { CanCreatePostPolicy } from '../../../domain/policies/can-create-post';
import { PostsRepository } from '../../../repos/ports/posts-repository';

type CreatePostError =
  ValidationError | PermissionError | NotFoundError | AnyServerError;

export type CreatePostResponse = Result<Post, CreatePostError>;

export class CreatePost implements UseCase<
  CreatePostCommand,
  CreatePostResponse
> {
  constructor(
    private postRepository: PostsRepository,
    private memberRepository: MembersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(request: CreatePostCommand): Promise<CreatePostResponse> {
    // Implement!
    throw new Error('To be implemented');
  }
}
