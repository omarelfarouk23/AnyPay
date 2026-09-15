const config = {
  preset: 'react-native',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((@react-native|react-native|@react-navigation|react-navigation|react-native-reanimated|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-native-svg|react-native-vector-icons|@expo|expo|expo-status-bar|expo-modules-core|expo-constants|expo-font|expo-image-picker|expo-notifications|expo-file-system|expo-asset|react-native-svg|react-native-reanimated|@react-native-async-storage|@react-native-community|@shopify|@nozbe|@unimodules|@react-native-firebase|@react-native-community|@react-native-linear-gradient|react-native-assembly|react-native-paper|react-native-modal|react-native-web|react-native-encrypted-storage|react-native-mmkv|react-native-nitro-modules))/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/navigation/**',
    '!src/screens/pay/ReceiptScanner', // skip SVG-heavy screen in unit tests
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

module.exports = config;
