import { faker } from '@faker-js/faker';

import { CreateMemberInput } from '@forumate/api';

export class CreateMemberInputBuilder {
  private props: CreateMemberInput = {
    username: faker.internet.username(),
    email: faker.internet.email(),
    userId: faker.string.uuid(),
  };

  withUsername(username: string): this {
    this.props.username = username;
    return this;
  }

  withEmail(email: string): this {
    this.props.email = email;
    return this;
  }

  withUserId(id: string): this {
    this.props.userId = id;
    return this;
  }

  build() {
    return this.props;
  }
}
