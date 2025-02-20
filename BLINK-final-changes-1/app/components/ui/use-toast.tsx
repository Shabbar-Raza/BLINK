import * as React from 'react';
import { ToastProps } from './toast';

type ToasterToast = ToastProps & {
  id: string;
  title?: string;
  description?: string;
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000;

type ToastState = {
  toasts: ToasterToast[];
};

type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'REMOVE_TOAST'; toastId?: string };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
    default:
      return state;
  }
};

const ToastContext = React.createContext<{
  toast: (props: ToasterToast) => void;
  dismiss: (toastId: string) => void;
} | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const toast = React.useCallback(
    (props: ToasterToast) => {
      const id = Math.random().toString(36).substring(2, 9);
      dispatch({ type: 'ADD_TOAST', toast: { ...props, id } });

      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', toastId: id });
      }, TOAST_REMOVE_DELAY);
    },
    []
  );

  const dismiss = React.useCallback((toastId: string) => {
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}
