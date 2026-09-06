import { IEventBus, InMemoryEventBus } from '@forumate/bus';
import { PrismaDatabase } from '@forumate/database';

import {
  MarketingModule,
  NotificationsModule,
  PostsModule,
  UsersModule,
  CommentsModule,
  MembersModule,
  VotesModule,
} from '../../modules';
import { Application } from '../application/application-interface';
import { Config } from '../config';
import { errorHandler } from '../errors';
import { WebServer } from '../infra/http';

export class CompositionRoot {
  // ---------------------------------------------------------------------------
  // Fields
  // ---------------------------------------------------------------------------

  private static instance: CompositionRoot | null = null;

  private config: Config;
  private eventBus: IEventBus;
  private dbConnection: PrismaDatabase;
  private webServer!: WebServer;

  private usersModule!: UsersModule;
  private marketingModule!: MarketingModule;
  private notificationsModule!: NotificationsModule;
  private membersModule!: MembersModule;
  private postsModule!: PostsModule;
  private commentsModule!: CommentsModule;
  private votesModule!: VotesModule;

  // ---------------------------------------------------------------------------
  // Construction
  // ---------------------------------------------------------------------------

  private constructor(config: Config) {
    this.config = config;

    this.dbConnection = this.createDBConnection();
    this.eventBus = this.createEventBus();
    this.webServer = this.createWebServer();
  }

  // ---------------------------------------------------------------------------
  // Public API — Creation & Lifecycle
  // ---------------------------------------------------------------------------

  public static createCompositionRoot(config: Config): CompositionRoot {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }

    return CompositionRoot.instance;
  }

  public async start(): Promise<void> {
    await this.dbConnection.connect();
    await this.webServer.start();
    await this.eventBus.initialize();

    this.usersModule = this.createUsersModule();
    this.notificationsModule = this.createNotificationsModule();
    this.marketingModule = this.createMarketingModule();

    this.membersModule = this.createMembersModule();
    this.postsModule = this.createPostsModule();
    this.commentsModule = this.createCommentsModule();
    this.votesModule = this.createVotesModule();

    this.mountRoutes();
    this.useErrorHandler();
  }

  public async stop(): Promise<void> {
    await this.webServer.stop();
    await this.eventBus.stop();
  }

  // ---------------------------------------------------------------------------
  // Public API — Accessors
  // ---------------------------------------------------------------------------

  public getApplication(): Application {
    return {
      users: this.usersModule.getUsersService(),
      posts: this.postsModule.getPostsService(),
      marketing: this.marketingModule.getMarketingService(),
      notifications: this.notificationsModule.getNotificationsService(),
      votes: this.votesModule.getVotesService(),
    };
  }

  public getDatabase(): PrismaDatabase {
    return this.dbConnection;
  }

  public getEventBus(): IEventBus {
    return this.eventBus;
  }

  public getWebServer(): WebServer {
    return this.webServer;
  }

  public getTransactionalEmailApi() {
    return this.notificationsModule.getTransactionalEmailApi();
  }

  public getContactListApi() {
    return this.marketingModule.getContactListApi();
  }

  public getModule(
    moduleName:
      'members' | 'users' | 'votes' | 'posts' | 'notifications' | 'marketing',
  ) {
    switch (moduleName) {
      case 'members':
        return this.membersModule;

      case 'users':
        return this.usersModule;

      case 'posts':
        return this.postsModule;

      case 'votes':
        return this.votesModule;

      case 'notifications':
        return this.notificationsModule;

      case 'marketing':
        return this.marketingModule;

      default:
        throw new Error(`Module ${moduleName} not found`);
    }
  }

  public getRepositories() {
    return {
      posts: this.postsModule.getPostsRepository(),
      comments: this.commentsModule.getCommentsRepository(),
      members: this.membersModule.getMembersRepository(),
      votes: this.votesModule.getVotesRepository(),
    };
  }

  // ---------------------------------------------------------------------------
  // Private — Application Composition
  // ---------------------------------------------------------------------------

  private mountRoutes(): void {
    this.usersModule.mountRouter(this.webServer);
    this.marketingModule.mountRouter(this.webServer);
    this.membersModule.mountRouter(this.webServer);
    this.postsModule.mountRouter(this.webServer);
    this.votesModule.mountRouter(this.webServer);
    this.commentsModule.mountRouter(this.webServer);
  }

  private useErrorHandler(): void {
    this.webServer.useErrorHandler(errorHandler);
  }

  // ---------------------------------------------------------------------------
  // Private — Module Factories
  // ---------------------------------------------------------------------------

  private createUsersModule(): UsersModule {
    return UsersModule.build(this.config);
  }

  private createNotificationsModule(): NotificationsModule {
    return NotificationsModule.build(this.eventBus, this.config);
  }

  private createMarketingModule(): MarketingModule {
    return MarketingModule.build(this.config);
  }

  private createMembersModule(): MembersModule {
    return MembersModule.build(this.dbConnection, this.eventBus, this.config);
  }

  private createPostsModule(): PostsModule {
    return PostsModule.build(
      this.dbConnection,
      this.config,
      this.eventBus,
      this.membersModule.getMembersRepository(),
    );
  }

  private createCommentsModule(): CommentsModule {
    return CommentsModule.build(
      this.dbConnection,
      this.membersModule.getMembersRepository(),
      this.postsModule.getPostsRepository(),
      this.eventBus,
      this.config,
    );
  }

  private createVotesModule(): VotesModule {
    return VotesModule.build(
      this.dbConnection,
      this.membersModule.getMembersRepository(),
      this.commentsModule.getCommentsRepository(),
      this.postsModule.getPostsRepository(),
      this.eventBus,
      this.config,
    );
  }

  // ---------------------------------------------------------------------------
  // Private — Infrastructure Factories
  // ---------------------------------------------------------------------------

  private createDBConnection(): PrismaDatabase {
    const dbConnection = new PrismaDatabase();

    if (!this.dbConnection) {
      this.dbConnection = dbConnection;
    }

    return dbConnection;
  }

  private createEventBus(): IEventBus {
    return new InMemoryEventBus();
  }

  private createWebServer(): WebServer {
    return new WebServer(this.config);
  }
}
