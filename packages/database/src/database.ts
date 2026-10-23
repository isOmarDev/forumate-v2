import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './prisma/generated/client';

export interface IDatabase {
  getClient(): PrismaClient;
  connect(): Promise<void>;
}

export class PrismaDatabase implements IDatabase {
  private client: PrismaClient;

  constructor() {
    this.client = this.createClient();
  }

  private createClient() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });

    return new PrismaClient({ adapter });
  }

  public getClient() {
    return this.client;
  }

  public async connect() {
    await this.client.$connect();
  }

  public async disconnect() {
    await this.client.$disconnect();
  }
}

export class FakeDatabase implements IDatabase {
  constructor() {}

  public getClient() {
    return {} as PrismaClient;
  }

  public async connect() {
    return Promise.resolve();
  }
}
