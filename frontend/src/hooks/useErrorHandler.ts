import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useCallback } from 'react';

export function useErrorHandler() {
  const { openAuthModal } = useAuthContext();

  const handleError = useCallback((error: any, fallbackMessage: string = 'An unexpected error occurred.') => {
    const status = error?.status;
    let message = error?.message || fallbackMessage;

    // Check for nested validation message or list from FastAPI (422)
    if (status === 422 || status === 400) {
      let description = '';
      if (Array.isArray(message)) {
        description = message.map((err: any) => err.msg || err.message).join(', ');
      } else if (typeof message === 'object' && message !== null) {
        description = message.msg || message.message || JSON.stringify(message);
      } else {
        description = message;
      }
      
      toast.error("Validation Error", {
        description: description || "Please verify your input and try again.",
      });
      return;
    }

    if (status === 401) {
      openAuthModal(message || "Authentication required. Please sign in to continue.");
      return;
    }

    if (status === 403) {
      toast.error("Access Forbidden", {
        description: message || "You do not have permission to perform this action.",
      });
      return;
    }

    if (status >= 500) {
      toast.error("Server Error", {
        description: "A server error occurred. Please try again later.",
      });
      return;
    }

    // Fallback error
    toast.error("Error", {
      description: typeof message === 'string' ? message : fallbackMessage,
    });
  }, [openAuthModal]);

  return { handleError };
}

export default useErrorHandler;
