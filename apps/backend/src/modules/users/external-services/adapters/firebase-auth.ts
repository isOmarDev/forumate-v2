import fs from 'fs';
import path from 'path';
import { auth } from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';

import { User } from '../../domain/user';
import { IdentityServiceApi } from '../ports/identity-service-api';
import { NotFoundError } from '@forumate/errors/application';

export class FirebaseAuth implements IdentityServiceApi {
  private firebaseAuth: auth.Auth;

  constructor() {
    this.initialize();
    this.firebaseAuth = auth();
  }

  initialize() {
    const serviceAccount = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../../../../service-key.json'),
        'utf8',
      ),
    );

    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  async getUserById(userId: string): Promise<User | NotFoundError> {
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
        return new NotFoundError('user');
      }
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User | NotFoundError> {
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
        return new NotFoundError('user');
      }
      throw error;
    }
  }
}
