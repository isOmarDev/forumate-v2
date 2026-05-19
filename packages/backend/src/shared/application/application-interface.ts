import { MarketingService } from '../../modules/marketing/marketing-service';
import { PostService } from '../../modules/post/post-service';
import { UserService } from '../../modules/user/user-service';

export interface IApplication {
  user: UserService;
  marketing: MarketingService;
  post: PostService;
}
