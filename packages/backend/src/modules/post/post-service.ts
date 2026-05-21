import { IPostRepository } from './ports/post-repository';

export class PostService {
  constructor(private postRepo: IPostRepository) {}

  async getPosts(filters?: {}) {
    return await this.postRepo.findAll(filters);
  }
}
