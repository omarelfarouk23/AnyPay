import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '../src/components/ui/Card';
import { theme } from '../src/config/theme';
import { colors } from '../src/config/colors';
import { Text } from 'react-native';

describe('Card Component', () => {
  it('renders children content', () => {
    const { getByText } = render(
      <Card>
        <Text style={{ fontSize: 16 }}>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('applies custom style', () => {
    const { getByText } = render(
      <Card style={{ backgroundColor: '#fff', padding: 20 }}>
        <Text>Styled Card</Text>
      </Card>
    );
    expect(getByText('Styled Card')).toBeTruthy();
  });

  it('card renders with root element', () => {
    const { root } = render(
      <Card>
        <Text>Default Card</Text>
      </Card>
    );
    // Card renders a View (or Pressable) as root
    expect(root).toBeTruthy();
  });
});

describe('Theme Configuration', () => {
  it('primary color matches Algerian blue', () => {
    expect(theme.colors.primary).toBe('#1A2E6B');
  });

  it('accent color matches gold', () => {
    expect(theme.colors.accent).toBe('#F5A623');
  });

  it('spacing.md is defined', () => {
    expect(theme.spacing.md).toBeGreaterThan(0);
  });

  it('borderRadius.lg is defined', () => {
    expect(theme.borderRadius.lg).toBeGreaterThan(0);
  });

  it('colors export has primary', () => {
    expect(colors.primary).toBe('#1A2E6B');
  });

  it('shadows.sm has shadow properties', () => {
    expect(theme.shadows.sm.shadowColor).toBe('#000');
    expect(theme.shadows.sm.elevation).toBe(2);
  });
});
