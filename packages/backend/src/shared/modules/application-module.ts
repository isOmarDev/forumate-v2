import { Config } from '../config';

export class ApplicationModule {
  constructor(private config: Config) {}

  protected getEnvironment() {
    return this.config.getEnvironment();
  }

  protected getScript() {
    return this.config.getScript();
  }

  get shoudBuildFakeRepository() {
    return this.getScript() === 'test:unit';
  }
}
