type ValidMethodNames<T> = keyof T;

interface Call<T> {
  methodName: ValidMethodNames<T>;
  args: unknown[];
  context: any;
}

type Calls<T> = Call<T>[];

export abstract class Spy<T> {
  protected calls: Calls<T>;

  constructor() {
    this.calls = [];
  }

  protected addCall<MethodName extends ValidMethodNames<T>>(
    methodName: MethodName,
    args: unknown[],
    context?: any,
  ) {
    this.calls.push({ methodName, args, context });
  }

  getTimesMethodCalled<MethodName extends ValidMethodNames<T>>(
    methodName: MethodName,
  ) {
    const calls = this.calls.filter((call) => call.methodName === methodName);
    return calls.length;
  }

  getCalls(): Calls<T> {
    return this.calls;
  }

  reset() {
    this.calls = [];
  }
}
