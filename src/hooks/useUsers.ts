import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listUsers, getUser, deleteUser, banUser, unbanUser } from '../api/users';

export const useUsers = (page: number) =>
  useQuery({ queryKey: ['users', page], queryFn: () => listUsers(page) });

export const useUser = (uid: string) =>
  useQuery({ queryKey: ['user', uid], queryFn: () => getUser(uid) });

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useBanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: banUser,
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.setQueryData(['user', updated.uid], updated);
    },
  });
};

export const useUnbanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unbanUser,
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.setQueryData(['user', updated.uid], updated);
    },
  });
};
