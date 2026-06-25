import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { setToken, clearToken } from '../lib/token';

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  return () => {
    clearToken();
    navigate('/login');
  };
};