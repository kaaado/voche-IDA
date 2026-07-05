import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import { toast } from 'sonner';
import { useErrorHandler } from './useErrorHandler';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEventById(id?: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getById(id!),
    enabled: !!id,
  });
}

export function useRegisterEvent(id?: string) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: () => eventService.register(id!),
    onSuccess: () => {
      toast.success('Registration Successful', {
        description: 'You have been registered!',
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (err) => {
      handleError(err, 'Could not register. Please try again.');
    },
  });
}

export function useCancelRegistration(id?: string) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: () => eventService.cancelRegistration(id!),
    onSuccess: () => {
      toast.info('Registration Cancelled', {
        description: 'You are no longer registered.',
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (err) => {
      handleError(err, 'Could not cancel. Please try again.');
    },
  });
}