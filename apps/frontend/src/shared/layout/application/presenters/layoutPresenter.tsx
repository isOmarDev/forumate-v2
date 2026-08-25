import { makeAutoObservable, reaction } from 'mobx';

import { NavLayoutVm } from '../viewModels/navLayoutVm';

import { AuthStore } from '@/modules/auth/stores/authStore';
import { NavigationStore } from '@/shared/navigation/navigationStore';

export class LayoutPresenter {
  public navLayoutVm: NavLayoutVm | null;

  constructor(
    public authStore: AuthStore,
    public navigationStore: NavigationStore,
  ) {
    makeAutoObservable(this);
    this.setupSubscriptions();
    this.navLayoutVm = null;
  }

  private setupSubscriptions() {
    // Implement
  }

  async load(callback?: (navLayoutVm: NavLayoutVm) => void) {
    // Implement
  }

  async signOut() {
    // Implement
  }
}
