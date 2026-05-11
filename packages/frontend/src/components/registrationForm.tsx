import { useState } from 'react';
import { Link } from 'react-router-dom';

import { appSelectors, toClass } from '../shared/selectors';
import { CreateUserInput } from '@dddforum/shared/api/users';

interface RegistrationFormProps {
  onSubmit: (
    formDetails: CreateUserInput,
    allowMarketingEmails: boolean,
  ) => void;
}

const selectors = appSelectors.registration.registrationForm;

const FORM_FIELDS: Array<{
  key: keyof CreateUserInput;
  type: string;
  placeholder: string;
  selector: string;
}> = [
  {
    key: 'email',
    type: 'email',
    placeholder: 'Email',
    selector: selectors.email.selector,
  },
  {
    key: 'username',
    type: 'text',
    placeholder: 'Username',
    selector: selectors.username.selector,
  },
  {
    key: 'firstName',
    type: 'text',
    placeholder: 'First name',
    selector: selectors.firstname.selector,
  },
  {
    key: 'lastName',
    type: 'text',
    placeholder: 'Last name',
    selector: selectors.lastname.selector,
  },
  {
    key: 'password',
    type: 'password',
    placeholder: 'Password',
    selector: selectors.password.selector,
  },
];

const INITIAL_VALUE: CreateUserInput = {
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  password: '',
};

export const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<CreateUserInput>(INITIAL_VALUE);
  const [allowMarketingEmails, setAllowMarketingEmails] = useState(false);

  const handleFieldChange =
    (field: keyof CreateUserInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData, allowMarketingEmails);
  };

  return (
    <form className="registration-form" noValidate onSubmit={handleSubmit}>
      <div>Create Account</div>

      {FORM_FIELDS.map(({ key, type, placeholder, selector }) => (
        <input
          key={key}
          className={toClass(selector)}
          type={type}
          placeholder={placeholder}
          value={formData[key]}
          onChange={handleFieldChange(key)}
        />
      ))}

      <div>
        <label className="registration-label marketing-emails-label">
          <input
            className={toClass(selectors.marketingCheckbox.selector)}
            type="checkbox"
            checked={allowMarketingEmails}
            onChange={() => setAllowMarketingEmails((prev) => !prev)}
          />
          Want to be notified about events &amp; discounts?
        </label>
        <button className={toClass(selectors.submit.selector)} type="submit">
          Submit
        </button>
      </div>

      <div className="to-login">
        <div>Already have an account?</div>
        <Link to="/login">Login</Link>
      </div>
    </form>
  );
};
