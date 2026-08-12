import { makeAutoObservable } from 'mobx';
import { RegistrationVm } from '../viewModels/registrationVm';
import { AuthStore } from '@/modules/auth/stores/authStore';
import { NavigationStore } from '@/shared/navigation/navigationStore';
import { ToastAPI } from '@/shared/toast/toastAPI';
import { Result, success, fail } from '@forumate/core';
import { CreateUserErrors, CreateUserInput, UserDTO } from '@forumate/api';

export class RegistrationPresenter {
  public vm: RegistrationVm = new RegistrationVm();

  constructor(
    public navigationStore: NavigationStore,
    public authStore: AuthStore,
    public toastAPI: ToastAPI,
  ) {
    makeAutoObservable(this);
    <s></s>;
  }

  /**
   * @desc This method acts as the equivalent of an application layer use case on the backend.
   * @param input
   * @param allowMarketingEmails
   */

  async submitRegistrationForm(
    input: CreateUserInput,
    allowMarketingEmails: boolean,
  ): Promise<Result<UserDTO, CreateUserErrors>> {
    // Implement
    // @ts-ignore
    return fail();
  }
}
