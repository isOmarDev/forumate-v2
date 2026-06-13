import { Config } from '../config';

export class ApplicationModule {
  constructor(protected readonly config: Config) {}

  get shoudBuildFakeRepository() {
    return this.config.script === 'test:unit';
  }
}
