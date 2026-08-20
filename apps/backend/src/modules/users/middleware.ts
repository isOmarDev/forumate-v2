import { NextFunction, Request, Response } from 'express';
import { auth } from 'firebase-admin';

import { UnauthorizedError } from '@forumate/errors/application';

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: new UnauthorizedError(),
      });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await auth().verifyIdToken(token);

      if (!decodedToken.email) {
        return new UnauthorizedError();
      }

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: new UnauthorizedError(),
      });
    }
  } catch (error) {
    next(error);
  }
};
