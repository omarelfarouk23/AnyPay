=== Review Report ===

**Project:** AnyPay – a prototype Algerian mobile‑payment application built with React Native

**Scope of audit**: TypeScript, architecture, error handling, features missing, and line‑level comments.

---

### 1. TypeScript correctness

| File (line range) | Issue | Explanation |
|-------------------|-------|-------------|
| `services/api/auth.ts` (35‑55) | `LoginResponse` used before declaration in type annotations | The interface is imported from `../types/user`, but the shape of the API’s response (`success`, `user`, `token`) is not enforced. Any mismatch (e.g., missing `refreshToken`) will slip through. |
| `services/api/wallet.ts` (53‑60) | Return type of `makePayment` is `Transaction`, but the service may return additional fields like `id`, `status`. The caller expects exactly the same shape; a minor field change would break compilation. |
| `components/ui/Button.tsx` (28) | `size` prop type is `string` but only specific literals are used (`small|medium|large|lg`). Improper values produce `undefined` styles without compile‑time error. |
| `services/socket/socketService.ts` (41‑69) | The generic `Socket` instance has no typing on emitted events – functions like `onNewMessage` use `(data:…) => void` but cast to `() => void`. Unsafe cast hides potential type mismatch. |
| `store/authStore.ts` (45‑55) | `loginWithCredentials` assigns `token` and `refreshToken` only if `data.success`, but the function returns the raw `data`. The caller may rely on `token` being defined; in failure scenario this leads to `undefined` values, causing runtime errors. |
| `store/walletStore.ts` (27‑30) | `addTransaction` prepends to array but returns the new array via `set`; TypeScript infers the tuple type may be widened to `Transaction[]`, but no explicit type is hard‑coded. Subsequent usage may accidentally mutate state destructively. |

**Recommendations**:
* Use response DTOs generated from backend schemas (e.g., via `zod`/`io-ts`).
* Enforce literal types for UI props (`ButtonSize`).
* Remove unsafe casts in socket helpers; annotate event types accordingly.
* Guard against `undefined` returns by enriching the store actions to throw or return a Result type.

---

### 2. Architecture gaps vs a production Algerian payment app

1. **No centralized API client layer** – each service imports `apiClient` directly. Shared logic such as request headers, retry, and network status is duplicated. A higher‑order request wrapper would reduce duplication.
2. **Inconsistent state management** – `authStore` and `walletStore` use Zustand with normal `persist` strategy. No middleware to synchronize tokens between stores, leading to potential stale tokens when authentication changes.
3. **Missing offline support** – `walletStore` keeps transactions in memory only. No persistence or cache sync with local data store. In the event of network loss, the user will lose recent transfers.
4. **No messaging/callback architecture** – UI components directly call service functions. A domain‑event bus or use‑cases layer would decouple UI from data access.
5. **Single‑source–of‑truth for config** – `API_BASE_URL` is hard-coded in `config/endpoints` but not exposed via environment variables for staging/production. Hard‑coding makes it impossible to enable sandbox testing.

---

### 3. Missing error handling

| Layer | Current state | Observed gaps |
|-------|---------------|--------------|
| API clients | `handleApiError` returns structured error but callers always wrap in `new Error(err.message)`; stack traces lost. | Components cannot differentiate by HTTP status (e.g., 401 vs 500). |
| Socket services | Only `console.log` for connect/disconnect. No fallback or exponential back‑off beyond default `reconnectionAttempts`. | No notification to user; no reconnection UI. |
| Auth flow | `LoginScreen` uses `Alert` for both field validation and server errors. | No retry limit; non‑retryable errors (e.g., 403) return same UI message. |
| Wallet send | `walletService.sendMoney` throws generic `Error`. | No client‑side validation for balances or currency mismatch. |
| UI components | `Toast` component auto‑dismisses after 3s but has no error visibility for network failures. | User may never see failure of a request if silent. |

**Fixes**: return a typed `Result<T, ApiError>` from services, expose error codes to UI, show Snackbars for transient errors, and implement exponential back‑off for sockets.

---

### 4. Missing features

1. **Push notifications** – No integration with Firebase/OneSignal. Users cannot be alerted of pending transfers or wallet top‑up.
2. **Deep linking** – Navigation setup (`AppNavigator`) uses standard `StackNavigator` but no `Linking` configuration; `anypay://wallet` or `anypay://chat/<id>` will not work.
3. **Biometric authentication** – `LoginScreen` only accepts OTP. No `react-native-biometrics` or `TouchID` fallback.
4. **Offline mode** – No `NetInfo` listener or `AsyncStorage` queue for pending transactions.
5. **Internationalisation** – UI strings are hard‑coded Arabic; no `i18n` framework for switching languages.
6. **Security hardening** – No sanitisation of user input (especially OTP); no rate‑limit handling for repeated OTP requests.
7. **Analytics & logging** – No integration with Sentry or App Center.

---

### 5. Specific file:line issues

* `services/api/client.ts` (14‑24) – auth token set via mutable closure; not thread‑safe for concurrent requests.
* `screens/auth/LoginScreen.tsx` (77‑85) – hard‑coded demo user object; overrides real API response.
* `services/socket/socketService.ts` (52‑57) – `onNewMessage` casts event handler type to `() => void`, losing event payload.
* `store/authStore.ts` (53‑55) – `isAuthenticated` derived only from token presence; no revocation check or expired token handling.
* `components/ui/Button.tsx` (29‑33) – `size` prop accepts `string` but logic expects specific literals, leading to `undefined` styles if an unsupported value is passed.

---

### 6. Actionable next steps

1. Add a **centralized request wrapper** that injects auth headers, retries on 5xx, and maps errors to a `Result` type.
2. Replace **Zustand persistence** with a single middleware that shares tokens and handles token refresh events.
3. Implement **push notifications** via Firebase – add `@react-native-firebase/messaging` and configure `Messaging.onMessage` callbacks.
4. Add `Linking` config to `AppNavigator` for deep links measured in `app.json` (e.g., `scheme: 'anypay'`).
5. Wire **biometric auth** using `expo-local-authentication` or `react-native-biometrics` and provide a fallback if not available.
6. Introduce **offline queue** using `AsyncStorage` and a background worker to retry declined requests.
7. Refactor **type safety** in the socket layer – use a typed event emitter like `EventEmitter` or `socket.io-client` generics.
8. Move all UI strings into an `i18n` resource file and wrap components with the `useTranslation` hook.
9. Add **unit tests** for service functions using `jest` and `msw` to mock network.

---

**Conclusion**: The current codebase demonstrates a solid React Native skeleton with modular services and stores. However, several critical TypeScript safety gaps, architectural inconsistencies, and missing production‑grade features remain. Addressing the listed recommendations will bring the app closer to a robust, maintainable, and user‑friendly payment platform suitable for living in Algeria.

=== End of Report ===