import { cert, getApps, initializeApp } from 'firebase-admin/app';
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
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn(
        'Firebase credentials are missing. Firebase auth will not be initialized.',
      );
      return;
    }

    const serviceAccount = {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };

    const app =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount),
          });

    this.firebaseAuth = getAuth(app);
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
