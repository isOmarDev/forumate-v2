// import { DecodedIdToken } from 'firebase-admin/auth';
import { DecodedIdToken } from '@forumate/api';

declare global {
  namespace Express {
    interface Request {
      user: DecodedIdToken;
    }
  }
}

export {};
