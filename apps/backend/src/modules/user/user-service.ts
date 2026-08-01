import { CreateUserCommand } from './user-command';
import { IUserRepository } from './ports/user-repository';
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
  UserNotFoundException,
} from './user-exceptions';
import { ITransactionalEmailApi } from '../notification/ports/transactional-email-api';

export class UserService {
  constructor(
    private repo: IUserRepository,
    private emailApi: ITransactionalEmailApi,
  ) {}

  async createUser(dto: CreateUserCommand) {
    const existingUserByEmail = await this.repo.findByEmail(dto.email);

    if (existingUserByEmail) {
      throw new EmailAlreadyInUseException();
    }

    const existingUserByUsername = await this.repo.findByUsername(dto.username);

    if (existingUserByUsername) {
      throw new UsernameAlreadyTakenException();
    }

    const { password, ...user } = await this.repo.create(dto.props);

    await this.emailApi.sendMail({
      to: user.email,
      subject: `Welcome ${user.firstName} to our forum!`,
      text: 'We are honored to have you in our forum, please feel free to explore it.',
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.repo.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException(email);
    }

    const { password, ...result } = user;

    return result;
  }

  async getUsers(filters?: { email?: string }) {
    const users = await this.repo.findAll(filters);
    return users.map((user) => {
      const { password, ...restUser } = user;
      return restUser;
    });
  }
}
