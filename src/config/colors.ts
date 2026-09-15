// src/config/colors.ts
export type Colors = {
  // Primary palette
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryAlpha: string;
  primaryAlphaStrong: string;

  // Accent (Algerian signature)
  accent: string;
  accentLight: string;
  accentDark: string;
  accentAlpha: string;

  // Semantic
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;

  // Surfaces
  background: string;
  card: string;
  surface: string;
  surfaceElevated: string;
  overlayMain: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textOnPrimary: string;
  textOnAccent: string;

  // Borders & dividers
  border: string;
  borderLight: string;
  divider: string;

  // Overlay
  overlay: string;
  overlayLight: string;

  // Material 3 surface tokens (Stitch pay design mapping)
  surfaceContainer: string;        // #F0EDED — default surface
  surfaceContainerLow: string;     // #F6F3F2
  surfaceContainerHigh: string;    // #EAE7E7
  surfaceContainerHighest: string; // #E5E2E1
  surfaceBright: string;           // #FCF9F8
  inverseSurface: string;          // #313030
  inverseOnSurface: string;        // #F3F0EF
  inversePrimary: string;          // #45E17C
  outline: string;                 // #6C7B6C — used as outline color in Stitch
  onSurface: string;               // #1C1B1B — primary text on surface
  onSurfaceVariant: string;        // #3D4A3D — secondary text
  secondary: string;               // #4A5E87
  secondaryFixed: string;          // #D8E2FF
  onSecondaryFixed: string;        // #011A40

  // Payment green (Stitch primary-container #07C160)
  paymentGreen: string;
  onPaymentGreen: string;
  paymentGreenAlpha: string;
  paymentGreenLight: string;
};

export const colors: Colors = {
  // Primary palette
  primary: '#1A2E6B',
  primaryLight: '#2E4CB8',
  primaryDark: '#0F1B44',
  primaryAlpha: 'rgba(26, 46, 107, 0.12)',
  primaryAlphaStrong: 'rgba(26, 46, 107, 0.25)',

  // Accent (Algerian signature)
  accent: '#F5A623',
  accentLight: '#F7C35A',
  accentDark: '#C6820E',
  accentAlpha: 'rgba(245, 166, 35, 0.15)',

  // Semantic
  success: '#27AE60',
  successLight: '#D4EFDF',
  warning: '#F39C12',
  warningLight: '#FDEBD0',
  error: '#E74C3C',
  errorLight: '#FADBD8',
  info: '#3498DB',
  infoLight: '#D6EAF8',

  // Surfaces
  background: '#F5F7FA',
  card: '#FFFFFF',
  surface: '#F0F2F5',
  surfaceElevated: '#FFFFFF',
  overlayMain: 'rgba(0, 0, 0, 0.5)',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#4A4A6A',
  textTertiary: '#8A8AA0',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#1A1A2E',

  // Borders & dividers
  border: '#E2E4EB',
  borderLight: '#F0F2F5',
  divider: '#E8EAED',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Payment flow (Stitch green #07C160)
  paymentGreen: '#07C160',
  onPaymentGreen: '#00471F',
  paymentGreenAlpha: 'rgba(7, 193, 96, 0.15)',
  paymentGreenLight: '#D4F5E0',
  secondaryFixed: '#D8E2FF',
  onSecondaryFixed: '#011A40',
  secondary: '#4A5E87',
  surfaceContainer: '#F0EDED',
  surfaceContainerLow: '#F6F3F2',
  surfaceContainerHigh: '#EAE7E7',
  surfaceContainerHighest: '#E5E2E1',
  surfaceBright: '#FCF9F8',
  inverseSurface: '#313030',
  inverseOnSurface: '#F3F0EF',
  inversePrimary: '#45E17C',
  outline: '#6C7B6C',
  onSurface: '#1C1B1B',
  onSurfaceVariant: '#3D4A3D',
};