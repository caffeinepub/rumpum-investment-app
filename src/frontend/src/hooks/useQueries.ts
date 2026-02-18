import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, Portfolio, Transaction, InvestmentPlan } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

export function useGetPortfolio() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Portfolio | null>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const principal = identity.getPrincipal();
      return actor.getPortfolio(principal);
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetLiveTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['liveTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLiveTransactions();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

export function useGetInvestmentPlans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InvestmentPlan[]>({
    queryKey: ['investmentPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlans();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useJoinPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.joinPlan(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Successfully joined investment plan!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to join plan: ${error.message}`);
    },
  });
}

export function useDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, reference }: { amount: bigint; reference: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deposit(amount, reference);
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['liveTransactions'] });
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(`Deposit failed: ${error.message}`);
    },
  });
}

export function useWithdraw() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, reference }: { amount: bigint; reference: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.withdraw(amount, reference);
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['liveTransactions'] });
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(`Withdrawal failed: ${error.message}`);
    },
  });
}
