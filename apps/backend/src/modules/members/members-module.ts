import { EventBus } from '@forumate/bus';
import { Database } from '@forumate/database';

import { Config } from '../../shared/config';
import { WebServer } from '../../shared/http';
import { ApplicationModule } from '../../shared/modules/application-module';

import { MemberService } from './application/members-service';
import { membersErrorHandler } from './member-errors';
import { MembersController } from './members-controller';
import { ProductionMembersRepository } from './repos/adapters/production-members-repository';
import { MembersRepository } from './repos/ports/members-repository';

export class MembersModule extends ApplicationModule {
  private membersRepository: MembersRepository;
  private memberService: MemberService;
  private membersController: MembersController;

  private constructor(
    db: Database,
    private eventBus: EventBus,
    config: Config,
  ) {
    super(config);
    // Create the tree in reverse (repos, services, controllers)
    this.membersRepository = this.createMembersRepository(db);
    this.memberService = this.createMembersService();
    this.membersController = this.createMembersController(config);
  }

  createMembersController(config: Config) {
    return new MembersController(
      this.memberService,
      membersErrorHandler,
      config,
    );
  }

  createMembersService() {
    return new MemberService(this.membersRepository, this.eventBus);
  }

  getMemberRepository() {
    return this.membersRepository;
  }

  createMembersRepository(db: Database) {
    return new ProductionMembersRepository(db);
  }

  getMembersRepository() {
    return this.membersRepository;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter('/members', this.membersController.getRouter());
  }

  public static build(db: Database, eventBus: EventBus, config: Config) {
    return new MembersModule(db, eventBus, config);
  }
}
