import { MembersService } from '../../../application/members-service';

import { CreateMemberController } from './create-member-controller';

export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  public createMember(): CreateMemberController {
    return new CreateMemberController(this.membersService);
  }
}
