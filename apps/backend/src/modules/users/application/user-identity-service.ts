import { UserDetails } from '../domain/entities/user-details';
import { UserNotFoundError } from '../domain/errors/users-errors';

import { type IIdentityServiceApi } from './ports/identity-service-api';

export class UserIdentityService {
  constructor(private identityServiceApi: IIdentityServiceApi) {}

  async getUserById(userId: string) {
    try {
      const user = await this.identityServiceApi.getUserById(userId);
      if (user) {
        return user;
      }
      return new UserNotFoundError();
    } catch (err) {
      console.log(err);
      throw new Error('error occurreted getting user from service', {
        cause: err,
      });
    }
  }

  async getUserByEmail(email: string) {
    const prismaUser = await this.identityServiceApi.findUserByEmail(email);
    if (!prismaUser) {
      throw new UserNotFoundError(email);
    }
    return prismaUser;
  }

  async getUserDetailsByEmail(email: string) {
    const userModel = await this.identityServiceApi.findUserByEmail(email);
    if (!userModel) {
      throw new UserNotFoundError(email);
    }
    return UserDetails.toDTO(userModel);
  }
}
