import { makeAutoObservable } from 'mobx';

import { IPostsStore } from '../../stores/postsStore';
import { PostViewModel } from '../viewModels/postViewModel';
import {
  PostsFilterValue,
  SearchFilterViewModel,
} from '../viewModels/searchFilterViewModel';

import { AuthStore } from '@/modules/auth/stores/authStore';

export class PostsPresenter {
  postVMs: PostViewModel[];
  searchFilter: SearchFilterViewModel;

  constructor(
    private postsStore: IPostsStore,
    private authStore: AuthStore,
  ) {
    makeAutoObservable(this);
    this.postVMs = [];
    this.searchFilter = new SearchFilterViewModel('popular');
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    // Implement
  }

  async load(
    callback?: (posts: PostViewModel[], filter: SearchFilterViewModel) => void,
  ) {
    // Implement
  }

  switchSearchFilter(nextFilter: PostsFilterValue) {
    // Implement
  }
}
