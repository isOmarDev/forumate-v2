import { RegistrationPage } from './registration/registration-page';
import { PuppeteerPageDriver } from '../driver/puppeteer-page-driver';
import { AppNotifications, HeaderComponent } from '../components';

export interface App {
  notifications: AppNotifications;
  layout: Layout;
  pages: Pages;
}

export interface Layout {
  header: HeaderComponent;
}

export interface Pages {
  registration: RegistrationPage;
}

export const createAppObject = (pageDriver: PuppeteerPageDriver): App => {
  return {
    notifications: new AppNotifications(pageDriver),
    layout: { header: new HeaderComponent(pageDriver) },
    pages: { registration: new RegistrationPage(pageDriver) },
  };
};
