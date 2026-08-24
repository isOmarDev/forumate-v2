import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { CreateUserInput } from '@forumate/api';

import { usePresenters } from '../../shared/presenters/presentersContext';

import { RegistrationVm } from '@/modules/auth/application/viewModels/registrationVm';
import { RegistrationForm } from '@/modules/auth/components/registrationForm';
import { LayoutContainer } from '@/shared/layout/layoutContainer';
import { OverlaySpinner } from '@/shared/spinner/overlaySpinner';

export const RegisterPage = observer(() => {
  const { registration } = usePresenters();
  const [vm, setVm] = useState<RegistrationVm>(new RegistrationVm());

  useEffect(() => {
    setVm(vm);
  }, [registration.vm]);

  return (
    <LayoutContainer>
      <div>Create Account</div>
      <RegistrationForm
        onSubmit={(input: CreateUserInput, allowMarketingEmails: boolean) =>
          registration.submitRegistrationForm(input, allowMarketingEmails)
        }
      />
      <OverlaySpinner isActive={vm.isSubmitting} />
    </LayoutContainer>
  );
});
