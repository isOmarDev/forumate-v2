import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useStore } from '@/shared/store/storesContext';

interface NavigationProviderProps {
  children: React.ReactNode;
}

/**
 * Note: Treat this as an incoming infrastructure adapter.
 */

export const NavigationProvider = observer(
  ({ children }: NavigationProviderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { navigation } = useStore();

    useEffect(() => {
      navigation.setNavigateFunction(navigate);
    }, [navigate, navigation]);

    useEffect(() => {
      if (navigation.currentPath !== location.pathname) {
        navigation.updateCurrentPath(location.pathname);
      }
    }, [location.pathname, navigation]);

    return <>{children}</>;
  },
);
