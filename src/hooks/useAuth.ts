// src/hooks/useAuth.ts
import {create} from 'zustand';
import type {AuthState, User} from '../types/user';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}));

export const setUser = (user: User | null) =>
  useAuthStore.setState({
    user,
    isAuthenticated: user !== null,
    isLoading: false,
    error: null,
  });

export const setLoading = (loading: boolean) =>
  useAuthStore.setState({isLoading: loading});

export const setError = (error: string | null) =>
  useAuthStore.setState({error, isLoading: false});

export const logout = () =>
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
