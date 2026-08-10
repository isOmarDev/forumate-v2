import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/client';

export interface Database {
  getClient(): PrismaClient;
  connect(): Promise<void>;
}

export class PrismaDatabase implements Database {
  private client: PrismaClient;

  constructor() {
    this.client = this.createClient();
  }

  private createClient() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });

    return new PrismaClient({ adapter });
  }

  getClient() {
    return this.client;
  }

  async connect() {
    await this.client.$connect();
  }

  async disconnect() {
    await this.client.$disconnect();
  }
}

export class FakeDatabase implements Database {
  constructor() {}

  getClient() {
    return {} as PrismaClient;
  }

  async connect() {
    return Promise.resolve();
  }
}
