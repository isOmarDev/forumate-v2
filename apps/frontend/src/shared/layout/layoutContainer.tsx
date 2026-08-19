import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { usePresenters } from '../presenters/presentersContext';
import { OverlaySpinner } from '../spinner/overlaySpinner';

import { NavLayoutVm } from './application/viewModels/navLayoutVm';
import { LayoutComponent } from './components/layoutComponent';

// All components which use observables must use 'observer'
export const LayoutContainer = observer(({ children }: any) => {
  const { layout } = usePresenters();
  const [vm, setVmToLocalState] = useState<NavLayoutVm>();

  useEffect(() => {
    layout.load((navLayoutVm) => {
      setVmToLocalState(navLayoutVm);
    });
  }, [layout, layout.navLayoutVm]); // We observe the view model in the presenter

  // Start here!
  if (!vm) return <OverlaySpinner isActive={false} />;

  return (
    <LayoutComponent vm={vm} signOut={layout.signOut}>
      {children}
    </LayoutComponent>
  );
});
