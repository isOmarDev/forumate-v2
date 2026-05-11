import { useState } from 'react';
import { Link } from 'react-router-dom';

import { appSelectors, toClass } from '../shared/selectors';
import { CreateUserInput } from '@dddforum/shared/api/users';

export type RegistrationInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};

interface RegistrationFormProps {
  onSubmit: (
    formDetails: CreateUserInput,
    allowMarketingEmails: boolean,
  ) => void;
}

const selectors = appSelectors.registration.registrationForm;

export const RegistrationForm = (props: RegistrationFormProps) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [allowMarketingEmails, setAllowMarketingEmails] = useState(false);

  const toggleAllowMarketingEmails = () => {
    setAllowMarketingEmails(!allowMarketingEmails);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.onSubmit(
      {
        email,
        username,
        firstName,
        lastName,
        password: '1234',
      },
      allowMarketingEmails,
    );
  };

  return (
    <form className="registration-form" noValidate onSubmit={handleSubmit}>
      <div>Create Account</div>
      <input
        className={toClass(selectors.email.selector)}
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={toClass(selectors.username.selector)}
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className={toClass(selectors.firstname.selector)}
        type="text"
        placeholder="first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        className={toClass(selectors.lastname.selector)}
        type="text"
        placeholder="last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <div>
        <label className="registration-label marketing-emails-label">
          <input
            className={toClass(selectors.marketingCheckbox.selector)}
            type="checkbox"
            checked={allowMarketingEmails}
            onChange={() => toggleAllowMarketingEmails()}
          />
          Want to be notified about events & discounts?
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
