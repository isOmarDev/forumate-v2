import { CompositionRoot } from '../composition-root';
import { Config } from '../config';

const config = new Config('start');
const compositionRoot = CompositionRoot.createCompositionRoot(config);

const webServer = compositionRoot.getWebServer();
const database = compositionRoot.getDatabase();

export const app = webServer.getApp();
export const dbClient = database.getClient();

export const bootstrap = async () => {
  await database.connect();
  await webServer.start();
};
