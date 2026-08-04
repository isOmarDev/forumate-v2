import path from 'path';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/client';
import { config as dotenvConfig } from 'dotenv';

// Load the database env file (DATABASE_URL) if not already provided by the environment.
// This allows the backend to load its own app env (API_URL, NODE_ENV) while the
// database package owns the DATABASE_URL configuration.
if (!process.env.DATABASE_URL) {
  const env = process.env.NODE_ENV || 'development';
  const envFile = path.join(__dirname, `../.env.${env}`);
  dotenvConfig({ path: envFile });
}

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
