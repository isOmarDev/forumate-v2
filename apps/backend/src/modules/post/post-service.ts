import { IPostRepository } from './ports/post-repository';

export class PostService {
  constructor(private postRepo: IPostRepository) {}

  async getPosts(filters?: object) {
    return await this.postRepo.findAll(filters);
  }
}
