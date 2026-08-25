import { UserDto } from '@forumate/api/users';

export class UserDetails {
  // Temporary
  public static toDTO(model: any): UserDto {
    return {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      username: '',
    };
  }
}
