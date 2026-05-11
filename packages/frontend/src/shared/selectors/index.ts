type ElementType = keyof JSX.IntrinsicElements;

export type PageElementsSelector<T extends ElementType = ElementType> = {
  selector: string;
  type: T;
};

const el = <T extends ElementType>(
  selector: string,
  type: T,
): PageElementsSelector<T> => ({
  selector,
  type,
});

export const appSelectors = {
  registration: {
    registrationForm: {
      form: el('.registration-form', 'form'),
      email: el('.registration.email', 'input'),
      username: el('.registration.username', 'input'),
      firstname: el('.registration.first-name', 'input'),
      lastname: el('.registration.last-name', 'input'),
      password: el('.registration.password', 'input'),
      marketingCheckbox: el('.registration.marketing-emails', 'input'),
      submit: el('.registration.submit-button', 'button'),
    },
  },
  layout: { header: el('.header.username', 'div') },
  notifications: {
    failure: el('#failure-toast', 'div'),
    success: el('#success-toast', 'div'),
  },
} as const;

export const toClass = (input: string): string => {
  return input.slice(1).replace(/\./g, ' ');
};

export const toId = (input: string): string => {
  if (!input.startsWith('#')) {
    throw new Error('Input string must start with a hash symbol (#).');
  }

  return input.slice(1);
};
