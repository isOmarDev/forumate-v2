export type Environment = 'development' | 'production' | 'staging' | 'ci';

export type Script = 'start' | 'test:unit' | 'test:e2e' | 'test:infra';

export class Config {
  private readonly _env: Environment;
  private readonly _script: Script;
  private readonly _apiUrl: string;

  constructor(script: Script) {
    this._env = (process.env.NODE_ENV as Environment) || 'development';
    this._script = script;
    this._apiUrl = process.env.API_URL || 'http://localhost:3000';
  }

  get environment() {
    return this._env;
  }

  get script() {
    return this._script;
  }

  get apiUrl() {
    return this._apiUrl;
  }
}
