import { PostRepo } from './adapters/post-repo';

export class PostService {
  constructor(private postRepo: PostRepo) {}

  public async getPosts(filters?: {}) {
    return await this.postRepo.findAll(filters);
  }
}
