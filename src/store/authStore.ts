import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthState, User, LoginCredentials, OtpResponse, LoginResponse} from '../types/user';
import {apiClient, setAuthToken} from '../services/api/client';

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
  checkAuth: () => Promise<boolean>;
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

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: user !== null,
        }),

      setTokens: (token: string | null, refreshToken: string | null) =>
        set({token, refreshToken, isAuthenticated: !!token}),

      setLoading: (loading: boolean) => set({isLoading: loading}),

      setError: (error: string | null) => set({error}),

      loginWithCredentials: async (credentials: LoginCredentials) => {
        set({isLoading: true, error: null});
        try {
          const res = await apiClient.post<LoginResponse>('/auth/login', credentials);
          const data = res.data;
          if (data.success && data.user && data.token) {
            // SECURITY: Sync token with API client immediately so subsequent
            // requests in this session include the Authorization header.
            setAuthToken(data.token);
            set({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken ?? null,
              isAuthenticated: true,
              error: null,
            });
            return data;
          } else {
            set({error: data.message ?? 'فشل تسجيل الدخول'});
            throw new Error(data.message ?? 'فشل تسجيل الدخول');
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'خطأ في الشبكة';
          set({error: msg});
          throw err;
        } finally {
          set({isLoading: false});
        }
      },

      sendOtp: async (phoneNumber: string) => {
        set({isLoading: true, error: null});
        try {
          const res = await apiClient.post<OtpResponse>('/auth/otp/send', {phoneNumber});
          const data = res.data;
          if (!data.success) {
            const msg = data.message ?? 'فشل إرسال الرمز';
            set({error: msg});
            throw new Error(msg);
          }
          set({error: null});
          return data;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'خطأ في الشبكة';
          set({error: msg});
          throw err;
        } finally {
          set({isLoading: false});
        }
      },

      verifyOtp: async (phoneNumber: string, otp: string) => {
        set({isLoading: true, error: null});
        try {
          const res = await apiClient.post<LoginResponse>('/auth/otp/verify', {phoneNumber, otp});
          const data = res.data;
          if (data.success && data.user && data.token) {
            // SECURITY: Sync token with API client immediately
            setAuthToken(data.token);
            set({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken ?? null,
              isAuthenticated: true,
              error: null,
            });
            return data;
          } else {
            const msg = data.message ?? 'كود غير صحيح';
            set({error: msg});
            throw new Error(msg);
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'خطأ في الشبكة';
          set({error: msg});
          throw err;
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

      clearAuth: () => {
        // SECURITY: Clear the token from the API client when logging out,
        // so no subsequent requests use the stale token.
        setAuthToken(null);
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const {token, isAuthenticated} = get();
        if (!token || !isAuthenticated) return false;
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data && res.data.id) {
            set({user: res.data});
            return true;
          }
          get().clearAuth();
          return false;
        } catch {
          get().clearAuth();
          return false;
        }
      },
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
      // SECURITY: When persisted state is restored from AsyncStorage,
      // synchronize the token with the API client so outgoing requests
      // include the Authorization header. Without this, the API client
      // would have no token until the next login.
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    },
  ),
);

export default useAuthStore;
