import axios from 'axios';

import { ApiResponse } from '.';

import {
  AnyServerError,
  InvalidRequestBodyError,
} from '@forumate/errors/server';
import {
  AnyApplicationError,
  ConflictError,
  ValidationError,
} from '@forumate/errors/application';
import { Result, TextUtil, fail, success } from '@forumate/core';

export type DecodedIdToken = {
  email: string;
  uid: string;
};

export type ValidatedUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

// Inputs
export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

// DTOs
export type UserDTO = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};

// Commands
export class CreateUserCommand {
  private constructor(public props: CreateUserInput) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ['email', 'firstName', 'lastName', 'username'];
    const isRequestInvalid =
      !body ||
      typeof body !== 'object' ||
      TextUtil.isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyError(requiredKeys);
    }

    const input = body as CreateUserInput;

    return CreateUserCommand.create(input);
  }

  static create(
    props: CreateUserInput,
  ): Result<CreateUserCommand, ValidationError> {
    const isEmailValid = props.email.indexOf('@') !== -1;
    const isFirstNameValid = TextUtil.isBetweenLength(props.firstName, 2, 16);
    const isLastNameValid = TextUtil.isBetweenLength(props.lastName, 2, 25);
    const isUsernameValid = TextUtil.isBetweenLength(props.username, 2, 25);

    if (
      !isEmailValid ||
      !isFirstNameValid ||
      !isLastNameValid ||
      !isUsernameValid
    ) {
      return fail(new ValidationError());
    }

    const { username, email, firstName, lastName } = props;

    return success(
      new CreateUserCommand({ email, firstName, lastName, username }),
    );
  }

  get email() {
    return this.props.email;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get username() {
    return this.props.username;
  }
}

// Errors
export type CreateUserErrors =
  | ConflictError // username, email
  | ValidationError
  | AnyServerError;

// Api Responses
export type CreateUserResponse = ApiResponse<UserDTO, CreateUserErrors['code']>;

export type UserNotFoundError = 'UserNotFound';
export type GetUserByEmailErrors = UserNotFoundError;

export type GetUserByEmailResponse = ApiResponse<UserDTO, GetUserByEmailErrors>;
export type GetUserErrors = GetUserByEmailErrors;

export type UserResponse = ApiResponse<
  CreateUserResponse | GetUserByEmailResponse | null,
  GetUserErrors | AnyServerError['code'] | AnyApplicationError['code']
>;

type AuthenticateResponse = any;

export const createUsersApi = (apiURL: string) => {
  return {
    authenticate: async (code: string) => {
      try {
        const successResponse = await axios.post(
          `${apiURL}/users/authenticate`,
          {
            code,
          },
        );
        return successResponse.data as AuthenticateResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as AuthenticateResponse;
        }

        return {
          data: null,
          error: {
            message: 'Network or server unreachable',
            code: 'NetworkError',
          },
          success: false,
        };
      }
    },
    register: async (input: CreateUserInput) => {
      try {
        const successResponse = await axios.post(`${apiURL}/users`, input);
        return successResponse.data as CreateUserResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as CreateUserResponse;
        }

        return {
          data: null,
          error: {
            message: 'Network or server unreachable',
            code: 'NetworkError',
          },
          success: false,
        };
      }
    },
    getUserByEmail: async (email: string) => {
      try {
        const successResponse = await axios.get(`${apiURL}/users`, {
          params: { email },
        });
        return successResponse.data as GetUserByEmailResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as GetUserByEmailResponse;
        }

        return {
          data: null,
          error: {
            message: 'Network or server unreachable',
            code: 'NetworkError',
          },
          success: false,
        };
      }
    },
  };
};
