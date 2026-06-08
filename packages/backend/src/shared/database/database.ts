import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/client';

export class Database {
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
