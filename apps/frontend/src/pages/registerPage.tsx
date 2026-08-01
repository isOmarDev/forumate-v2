import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { api } from '../api';
import { Layout } from '../components/layout';
import { RegistrationForm } from '../components/registrationForm';
import { useUser } from '../contexts/userContext';
import { useSpinner } from '../contexts/spinnerContext';
import { OverlaySpinner } from '../components/overlaySpinner';
import { CreateUserInput } from '@forumate/shared/api/users';

const FAILURE_TOAST_ID = `failure-toast`;
const SUCCESS_TOAST_ID = `success-toast`;

type ValidationResult = {
  success: boolean;
  errorMessage?: string;
};

function validateForm(input: CreateUserInput): ValidationResult {
  if (input.email.indexOf('@') === -1)
    return { success: false, errorMessage: 'Email invalid' };
  if (input.username.length < 2)
    return { success: false, errorMessage: 'Username invalid' };
  return { success: true };
}

export const RegisterPage = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const spinner = useSpinner();

  const handleSubmitRegistrationForm = async (
    input: CreateUserInput,
    addEmailToList: boolean,
  ) => {
    const validationResult = validateForm(input);

    if (!validationResult.success) {
      return toast.error(validationResult.errorMessage, {
        toastId: FAILURE_TOAST_ID,
      });
    }

    spinner.activate();

    try {
      const response = await api.users.register(input);

      if (!response.success) {
        switch (response.error?.code) {
          case 'EmailAlreadyInUse':
            return toast.error(
              'This email is already in use. Perhaps you want to log in?',
              { toastId: FAILURE_TOAST_ID },
            );
          case 'UsernameAlreadyTaken':
            return toast.error(
              'Please try a different username, this one is already taken.',
            );
          case 'ValidationError':
            return toast.error(response.error.message, {
              toastId: FAILURE_TOAST_ID,
            });
          case 'ServerError':
          default:
            return toast.error('Some backend error occurred', {
              toastId: FAILURE_TOAST_ID,
            });
        }
      }

      if (addEmailToList) {
        await api.marketing.addEmailToList(input.email);
      }

      setUser(response.data!.user);

      spinner.deactivate();

      toast('Success! Redirecting home.', {
        toastId: SUCCESS_TOAST_ID,
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      spinner.deactivate();
      return toast.error('Some backend error occurred', {
        toastId: FAILURE_TOAST_ID,
      });
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <RegistrationForm
        onSubmit={(input: CreateUserInput, allowMarketingEmails: boolean) =>
          handleSubmitRegistrationForm(input, allowMarketingEmails)
        }
      />
      <OverlaySpinner isActive={spinner.spinner?.isActive} />
    </Layout>
  );
};
