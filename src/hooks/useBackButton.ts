import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle browser back button navigation
 * Prevents going back completely - user must close tab to restart
 */
export function useBackButtonHandler() {
  const location = useLocation();

  useEffect(() => {
    // Disable back button completely
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.pathname);
    };

    // Push initial state
    window.history.pushState(null, '', window.location.pathname);
    
    // Add event listener
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);
}

/**
 * Hook to prevent accidental page navigation
 */
export function usePreventNavigation(shouldPrevent: boolean, message?: string) {
  useEffect(() => {
    if (!shouldPrevent) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message || 'Are you sure you want to leave? Your game progress will be lost.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldPrevent, message]);
}
