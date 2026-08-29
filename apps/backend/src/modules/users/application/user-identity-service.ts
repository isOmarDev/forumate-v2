import { UserDetails } from '../domain/user-details';
import { type IIdentityServiceApi } from '../identity/ports/identity-service-api';
import { UserNotFoundError } from '../users-errors';
import { UserNotFoundException } from '../users-exceptions';

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
      throw new UserNotFoundException(email);
    }
    return prismaUser;
  }

  async getUserDetailsByEmail(email: string) {
    const userModel = await this.identityServiceApi.findUserByEmail(email);
    if (!userModel) {
      throw new UserNotFoundException(email);
    }
    return UserDetails.toDTO(userModel);
  }
}
