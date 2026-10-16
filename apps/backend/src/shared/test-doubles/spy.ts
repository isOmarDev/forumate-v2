type MethodNames<T> = keyof T;

interface Call<T> {
  methodName: MethodNames<T>;
  args: unknown[];
  context: unknown;
}

type Calls<T> = Call<T>[];

export abstract class Spy<T> {
  protected calls: Calls<T>;

  constructor() {
    this.calls = [];
  }

  protected addCall<MethodName extends MethodNames<T>>(
    methodName: MethodName,
    args: unknown[],
    context?: unknown,
  ) {
    this.calls.push({ methodName, args, context });
  }

  public getTimesMethodCalled<MethodName extends MethodNames<T>>(
    methodName: MethodName,
  ) {
    const calls = this.calls.filter((call) => call.methodName === methodName);
    return calls.length;
  }

  public wasMethodCalled<MethodName extends MethodNames<T>>(
    methodName: MethodName,
  ): boolean {
    return this.getTimesMethodCalled(methodName) > 0;
  }

  public getCalls(): Calls<T> {
    return this.calls;
  }

  public reset() {
    this.calls = [];
  }
}
