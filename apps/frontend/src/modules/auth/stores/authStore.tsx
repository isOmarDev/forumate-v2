import { makeAutoObservable } from 'mobx';

import {
  ApiClient,
  CreateUserInput,
  CreateUserResponse,
  UserDTO,
} from '@forumate/api';

import { AuthState } from '../domain/authState';
import { MemberDm } from '../domain/memberDm';
import { UserDm } from '../domain/userDm';

export class AuthStore {
  public authState = new AuthState();

  constructor(public apiClient: ApiClient) {
    makeAutoObservable(this);
    this.initialize();
  }

  private async initialize() {}

  public getToken() {
    // Temporary for Pattern-First
    return 'temp';
  }

  getCurrentUser() {
    return this.authState.user;
  }

  getCurrentMember() {
    return this.authState.member;
  }

  public async register(
    input: CreateUserInput,
    allowMarketingEmails: boolean,
  ): Promise<CreateUserResponse> {
    // Implement
    throw new Error('Not yet implemented');
  }

  private setupInitialUserAndMember(userDTO: UserDTO) {
    this.authState.user = UserDm.fromDTO(userDTO);
    this.authState.member = MemberDm.fromInitialUser(this.authState.user);
  }

  public isAuthenticated(): boolean {
    return !!this.authState.user;
  }

  async logout(): Promise<void> {
    // Clear all state by updating properties
    this.authState.user = null;
    this.authState.member = null;
  }
}
