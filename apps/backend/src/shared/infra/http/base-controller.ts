import express from 'express';

import {
  type FailureApiResponse,
  type SuccessApiResponse,
} from '@forumate/api';
import { CustomError, type ErrorCode } from '@forumate/errors';

import { CATEGORY_TO_STATUS } from './http-status';
import { toApiError } from './to-api-error';

export abstract class BaseController {
  public ok<T>(
    res: express.Response<SuccessApiResponse<T>>,
    dto: T,
    status: 200 | 201 = 200,
  ) {
    return res.status(status).json({
      success: true,
      status,
      data: dto,
      error: null,
    });
  }

  public created<T>(res: express.Response<SuccessApiResponse<T>>, dto: T) {
    return this.ok(res, dto, 201);
  }

  public fail(
    res: express.Response<FailureApiResponse<ErrorCode>>,
    error: CustomError,
  ) {
    const status = CATEGORY_TO_STATUS[error.category];

    return res.status(status).json({
      success: false,
      data: null,
      status,
      error: toApiError(error),
    });
  }

  public noContent(res: express.Response) {
    return res.sendStatus(204);
  }

  public setCookie(
    res: express.Response,
    name: string,
    value: string,
    options: express.CookieOptions = {},
  ) {
    res.cookie(name, value, options);
  }

  public clearCookie(
    res: express.Response,
    name: string,
    options?: express.CookieOptions,
  ) {
    res.clearCookie(name, options);
  }

  public redirect(res: express.Response, url: string, status: 301 | 302 = 302) {
    return res.redirect(status, url);
  }

  public download(res: express.Response, path: string, filename?: string) {
    if (filename !== undefined) {
      return res.download(path, filename);
    }

    return res.download(path);
  }

  public sendFile(res: express.Response, path: string) {
    return res.sendFile(path);
  }
}
