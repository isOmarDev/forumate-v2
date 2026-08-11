import { UserNotFoundException } from '../users-exceptions';
import { UserDetails } from '../domain/user-details';
import { IdentityServiceApi } from '../external-services/ports/identity-service-api';
import { NotFoundError } from '@forumate/errors/application';

export class UserIdentityService {
  constructor(private identityServiceApi: IdentityServiceApi) {}

  async getUserById(userId: string) {
    try {
      const user = await this.identityServiceApi.getUserById(userId);
      if (user) {
        return user;
      }
      return new NotFoundError('user');
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
