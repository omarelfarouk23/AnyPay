import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthState, User, LoginCredentials, OtpResponse, LoginResponse} from '../types/user';

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
          const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials),
          });
          const data: LoginResponse = await res.json();
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
          set({error: 'خطأ في الشبكة'});
          return {success: false, message: 'خطأ في الشبكة'};
        } finally {
          set({isLoading: false});
        }
      },

      sendOtp: async (phoneNumber) => {
        set({isLoading: true, error: null});
        try {
          const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/otp/send`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({phoneNumber}),
          });
          const data: OtpResponse = await res.json();
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
          const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/otp/verify`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({phoneNumber, otp}),
          });
          const data: LoginResponse = await res.json();
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
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
          });
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
