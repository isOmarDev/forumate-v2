import { MarketingService } from '../../modules/marketing/application/marketing-service';
import { NotificationsService } from '../../modules/notifications/application/notifications-service';
import { PostsService } from '../../modules/posts/application/posts-service';
import { UserIdentityService } from '../../modules/users/application/user-identity-service';
import { VotesService } from '../../modules/votes/application/votes-service';

export interface Application {
  users: UserIdentityService;
  posts: PostsService;
  marketing: MarketingService;
  notifications: NotificationsService;
  votes: VotesService;
}
