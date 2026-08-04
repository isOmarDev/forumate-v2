import { useContext } from 'react';
import { UserContext } from './userContext';

// Custom hook to access the user context
export const useUser = () => {
  return useContext(UserContext);
};
