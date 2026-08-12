import { LayoutPresenter } from './layoutPresenter';
import { NavLayoutVm } from '../viewModels/navLayoutVm';
import { AuthStore } from '@/modules/auth/stores/authStore';
import { NavigationStore } from '@/shared/navigation/navigationStore';
import { setupAuthStoreWithMember } from '@/shared/testUtils';
import { createApiClient } from '@forumate/api';

describe('LayoutPresenter', () => {
  let presenter: LayoutPresenter;
  let authStore: AuthStore;
  let navigationStore: NavigationStore;
  let loadedVm: NavLayoutVm;

  beforeEach(() => {
    const apiClient = createApiClient('');

    authStore = new AuthStore(apiClient);
    navigationStore = new NavigationStore();
    presenter = new LayoutPresenter(authStore, navigationStore);
  });

  describe('layout', () => {
    it('should show username when member is authenticated', async () => {
      // Implement
    });

    it('should show no username when member is not authenticated', async () => {
      // Implement
    });
  });

  describe('actions', () => {
    it('should sign out the member and navigate to home', async () => {
      // Implement
    });
  });
});
