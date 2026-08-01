import { PuppeteerPageDriver } from '../driver';

export abstract class Component {
  constructor(protected driver: PuppeteerPageDriver) {}
}
