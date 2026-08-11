import { CanCreatePostPolicy } from './canCreatePost';

import { Post } from '../../../domain/post';
import { PostsRepository } from '../../../repos/ports/postsRepository';
import { MembersRepository } from '../../../../members/repos/ports/membersRepository';
import { CreatePostCommand } from '@forumate/api/posts';
import { EventBus } from '@forumate/bus';
import { AnyServerError } from '@forumate/errors/server';
import {
  NotFoundError,
  PermissionError,
  ValidationError,
} from '@forumate/errors/application';
import { Result, UseCase } from '@forumate/core';

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
