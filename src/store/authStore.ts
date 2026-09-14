import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthState, User, LoginCredentials, OtpResponse, LoginResponse} from '../types/user';
import {apiClient} from '../services/api/client';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setTokens: (token: string | null, refreshToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loginWithCredentials: (credentials: LoginCredentials) => Promise<LoginResponse>;
  sendOtp: (phoneNumber: string) => Promise<OtpResponse>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({user}),
      setTokens: (token, refreshToken) =>
        set({token, refreshToken, isAuthenticated: !!token}),
      setLoading: (isLoading) => set({isLoading}),
      setError: (error) => set({error}),

      loginWithCredentials: async (credentials) => {
        set({isLoading: true, error: null});
        try {
          const res = await apiClient.post<LoginResponse>('/auth/login', credentials);
          const data = res.data;
          if (data.success) {
            set({
              user: data.user ?? null,
              token: data.token ?? null,
              refreshToken: data.refreshToken ?? null,
              isAuthenticated: true,
              error: null,
            });
          } else {
            set({error: data.message ?? 'فشل تسجيل الدخول'});
          }
          return data;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'خطأ في الشبكة';
          set({error: 'خطأ في الشبكة'});
          return {success: false, message: 'خطأ في الشبكة'};
        } finally {
          set({isLoading: false});
        }
      },

      sendOtp: async (phoneNumber) => {
        set({isLoading: true, error: null});
        try {
          const res = await apiClient.post<OtpResponse>('/auth/otp/send', {phoneNumber});
          const data = res.data;
          if (!data.success) {
            set({error: data.message ?? 'فشل إرسال الكود'});
          }
          return data;
        } catch {
          set({error: 'خطأ في الشبكة'});
          return {success: false, message: 'خطأ في الشبكة'};
        } finally {
          set({isLoading: false});
        }
      },

      verifyOtp: async (phoneNumber, otp) => {
        set({isLoading: true, error: null});
        try {
          const res = await apiClient.post<LoginResponse>('/auth/otp/verify', {phoneNumber, otp});
          const data = res.data;
          if (data.success) {
            set({
              user: data.user ?? null,
              token: data.token ?? null,
              refreshToken: data.refreshToken ?? null,
              isAuthenticated: true,
              error: null,
            });
          } else {
            set({error: data.message ?? 'كود غير صحيح'});
          }
          return data;
        } catch {
          set({error: 'خطأ في الشبكة'});
          return {success: false, message: 'خطأ في الشبكة'};
        } finally {
          set({isLoading: false});
        }
      },

      logout: async () => {
        set({isLoading: true});
        try {
          await apiClient.post('/auth/logout');
        } catch {
          // ignore
        } finally {
          get().clearAuth();
          set({isLoading: false});
        }
      },

      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        }),
    }),
    {
      name: 'anypay-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
