import { createApiClient } from '@forumate/api';

import { fakePostsData } from '../../__tests__/fakePostsData';
import { FakePostsStore } from '../../stores/fakePostsStore';
import { PostViewModel } from '../viewModels/postViewModel';
import { SearchFilterViewModel } from '../viewModels/searchFilterViewModel';

import { PostsPresenter } from './postsPresenter';

import { AuthStore } from '@/modules/auth/stores/authStore';
import { setupAuthStoreWithMember } from '@/shared/testUtils';

describe('PostsPresenter', () => {
  const stubbedAPI = createApiClient('');
  const loadedPostsVm: PostViewModel[] = [];
  const postsStore = new FakePostsStore(fakePostsData);
  let authStore: AuthStore;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    authStore = new AuthStore(stubbedAPI);
  });

  it('can render a list of posts', async () => {
    // Implement
  });

  it('can switch between popular posts and new posts', async () => {
    // Implement
  });

  it('does not let level 1 users cast votes', async () => {
    // Implement
  });

  it('does let level 2 users cast votes', async () => {
    // Implement
  });
});
