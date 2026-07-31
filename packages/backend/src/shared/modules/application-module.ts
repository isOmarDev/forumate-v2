import { Config } from '../config';

export class ApplicationModule {
  constructor(protected readonly config: Config) {}

  get shouldBuildFakeRepository() {
    return this.config.script === 'test:unit';
  }
}
