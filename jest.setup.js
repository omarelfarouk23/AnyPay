import '@testing-library/jest-native/extend-expect';

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => ({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => ({ status: 'granted' })),
  setNotificationHandler: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleNotification: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getNotificationSubscriptionAsync: jest.fn(() => null),
  addNotificationReceivedListener: jest.fn(() => jest.fn()),
  addNotificationResponseReceivedListener: jest.fn(() => jest.fn()),
  removeNotificationSubscription: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  DocumentDirectoryPath: '/mock/document',
  CacheDirectoryPath: '/mock/cache',
  readAsStringAsync: jest.fn(() => Promise.resolve('')),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  deleteAsync: jest.fn(() => Promise.resolve()),
  copyAsync: jest.fn(() => Promise.resolve()),
  moveAsync: jest.fn(() => Promise.resolve()),
  createDownloadResumable: jest.fn(),
  downloadAsync: jest.fn(() => Promise.resolve({ uri: '/mock/downloaded' })),
  getContentUriAsync: jest.fn((uri) => uri),
  isVisibleAsync: jest.fn(() => Promise.resolve(true)),
  existsAsync: jest.fn(() => Promise.resolve(false)),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: '/mock/image.jpg', width: 100, height: 100 }] })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: '/mock/camera.jpg', width: 100, height: 100 }] })),
  launchDocumentPickerAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: '/mock/doc.pdf', name: 'doc.pdf' }] })),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaContext: () => ({ insets: { top: 0, right: 0, bottom: 0, left: 0 }, frame: { x: 0, y: 0, width: 375, height: 812 }, width: 375, height: 812 }),
}));

jest.mock('react-native-reanimated', () => ({
  useAnimatedStyle: () => ({}),
  withTiming: (value) => value,
  withSpring: (value) => value,
  runOnJS: (fn) => fn,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
  PanGestureHandler: ({ children, onGestureEvent }) => children,
  State: { BEGAN: 'began', FAILED: 'failed', ACTIVE: 'active', END: 'end' },
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: ({ children, ...props }) => React.createElement('svg', props, children),
    Path: ({ d, ...props }) => React.createElement('path', props, d),
    Circle: ({ cx, cy, r, ...props }) => React.createElement('circle', { cx, cy, r, ...props }),
    Rect: ({ x, y, width, height, ...props }) => React.createElement('rect', { x, y, width, height, ...props }),
    G: ({ children, ...props }) => React.createElement('g', props, children),
    Defs: ({ children }) => React.createElement('defs', null, children),
    LinearGradient: ({ id, children, ...props }) => React.createElement('linearGradient', { id, ...props }, children),
    Stop: ({ offset, stopColor, ...props }) => React.createElement('stop', { offset, stopColor, ...props }),
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  mergeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.useRealTimers();
