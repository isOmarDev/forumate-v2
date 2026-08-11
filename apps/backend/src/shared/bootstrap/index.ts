import { CompositionRoot } from '../composition-root';
import { Config } from '../config';

const config = new Config('start');

export async function bootstrap() {
  const composition = CompositionRoot.createCompositionRoot(config);
  return composition.start();
}
