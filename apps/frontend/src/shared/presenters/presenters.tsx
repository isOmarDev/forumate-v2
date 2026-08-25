import { PostsPresenter } from '../../modules/posts/application/presenters/postsPresenter';
import { LayoutPresenter } from '../layout/application/presenters/layoutPresenter';

import { RegistrationPresenter } from '@/modules/auth/application/presenters/registrationPresenter';

export class Presenters {
  constructor(
    public registration: RegistrationPresenter,
    public posts: PostsPresenter,
    public layout: LayoutPresenter,
  ) {}
}
