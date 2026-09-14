import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../src/components/ui/Button';
import { colors } from '../src/config/colors';

describe('Button component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Button title="Test" onPress={() => {}} />);
    expect(getByText('Test')).toBeTruthy();
  });
});

describe('Colors configuration', () => {
  it('has primary blue color', () => {
    expect(colors.primary).toBe('#1A2E6B');
  });

  it('has accent gold color', () => {
    expect(colors.accent).toBe('#F5A623');
  });
});
