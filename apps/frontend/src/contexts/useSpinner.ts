import { useContext } from 'react';
import { SpinnerContext } from './spinnerContext';

// Custom hook to access the spinner context
export const useSpinner = () => {
  return useContext(SpinnerContext);
};
