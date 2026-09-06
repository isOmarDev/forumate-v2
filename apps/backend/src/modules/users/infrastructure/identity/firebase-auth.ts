import fs from 'fs';
import path from 'path';

import { cert, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

import { NotFoundError } from '@forumate/errors/application';

import { IIdentityServiceApi } from '../../application/ports/identity-service-api';
import { User } from '../../domain/entities/user';
import { UserNotFoundError } from '../../domain/errors/users-errors';

export class FirebaseAuth implements IIdentityServiceApi {
  private firebaseAuth: Auth | null = null;

  constructor() {
    this.initialize();
  }

  initialize() {
    const serviceKeyPath = path.join(
      __dirname,
      '../../../../../service-key.json',
    );

    if (!fs.existsSync(serviceKeyPath)) {
      console.warn(
        'service-key.json not found. Firebase auth will not be initialized.',
      );
      return;
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceKeyPath, 'utf8'));

    initializeApp({
      credential: cert(serviceAccount),
    });
    this.firebaseAuth = getAuth();
  }

  async getUserById(userId: string): Promise<User | NotFoundError> {
    if (!this.firebaseAuth) {
      return new UserNotFoundError('user');
    }
    try {
      const userRecord = await this.firebaseAuth.getUser(userId);
      return {
        id: userRecord.uid,
        email: userRecord.email || '',
        emailVerified: userRecord.emailVerified,
        name: userRecord.displayName || '',
      };
    } catch (error) {
      if ((error as { code?: string }).code === 'auth/user-not-found') {
        return new UserNotFoundError('user');
      }
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User | NotFoundError> {
    if (!this.firebaseAuth) {
      return new UserNotFoundError('user');
    }
    try {
      const userRecord = await this.firebaseAuth.getUserByEmail(email);
      return {
        id: userRecord.uid,
        email: userRecord.email || '',
        emailVerified: userRecord.emailVerified,
        name: userRecord.displayName || '',
      };
    } catch (error) {
      if ((error as { code?: string }).code === 'auth/user-not-found') {
        return new UserNotFoundError('user');
      }
      throw error;
    }
  }
}
