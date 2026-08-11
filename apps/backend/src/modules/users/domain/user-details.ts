import { UserDTO } from '@forumate/api/users';

export class UserDetails {
  // Temporary
  public static toDTO(model: any): UserDTO {
    return {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      username: '',
    };
  }
}
