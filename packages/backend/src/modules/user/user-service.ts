import { CreateUserCommand } from './user-command';
import { IUserRepository } from './ports/user-repository';
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
} from './user-exceptions';

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  public async createUser(dto: CreateUserCommand) {
    const existingUserByEmail = await this.userRepo.findByEmail(dto.email);

    if (existingUserByEmail) {
      throw new EmailAlreadyInUseException();
    }

    const existingUserByUsername = await this.userRepo.findByUsername(
      dto.username,
    );

    if (existingUserByUsername) {
      throw new UsernameAlreadyTakenException();
    }

    const { password, ...user } = await this.userRepo.create(
      dto.props as CreateUserCommand,
    );
    return user;
  }

  public async getUsers(filters?: { email?: string }) {
    const users = await this.userRepo.findAll(filters);
    return users.map((user) => {
      const { password, ...restUser } = user;
      return restUser;
    });
  }
}
