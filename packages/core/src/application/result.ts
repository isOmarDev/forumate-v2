interface SuccessResponse<T> {
  readonly success: true;
  readonly value: T;
}

interface FailureResponse<E> {
  readonly success: false;
  readonly error: E;
}

type ResultState<T, E> = SuccessResponse<T> | FailureResponse<E>;

export class Result<T, E> {
  private constructor(private readonly state: ResultState<T, E>) {}

  static success<T, E = never>(value: T): Result<T, E> {
    return new Result<T, E>({ success: true, value });
  }

  static failure<T = never, E = unknown>(error: E): Result<T, E> {
    return new Result<T, E>({ success: false, error });
  }

  get isSuccess(): boolean {
    return this.state.success;
  }

  get isFailure(): boolean {
    return !this.state.success;
  }

  /**
   * Unsafe accessor: throws if called on the wrong branch.
   * Prefer match() when you need compile-time safety.
   */
  getValue(): T {
    if (!this.state.success) {
      throw new Error('Cannot get value from a failed result');
    }
    return this.state.value;
  }

  /**
   * Unsafe accessor: throws if called on the wrong branch.
   * Prefer match() when you need compile-time safety.
   */
  getError(): E {
    if (this.state.success) {
      throw new Error('Cannot get error from a successful result');
    }
    return this.state.error;
  }

  /**
   * Exhaustive, type-safe consumption — no throw risk, no fake narrowing.
   * TypeScript knows `value: T` and `error: E` are correct in each branch
   * because the check happens right here against the real discriminant.
   */
  match<R>(handlers: {
    success: (value: T) => R;
    failure: (error: E) => R;
  }): R {
    return this.state.success
      ? handlers.success(this.state.value)
      : handlers.failure(this.state.error);
  }
}

export function success<T, E = never>(value: T): Result<T, E> {
  return Result.success<T, E>(value);
}

export function fail<T = never, E = unknown>(error: E): Result<T, E> {
  return Result.failure<T, E>(error);
}
