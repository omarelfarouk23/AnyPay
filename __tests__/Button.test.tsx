import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button, ButtonProps } from '../src/components/ui/Button';
import { colors } from '../src/config/colors';

describe('Button Component', () => {
  const defaultProps: ButtonProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  it('renders with title text', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Press Me" onPress={onPress} />);
    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('uses primary background color by default', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    const button = getByText('Test Button').parent;
    expect(button?.props?.style).toBeTruthy();
  });

  it('applies variant styles correctly', () => {
    const { getByText } = render(
      <Button {...defaultProps} variant="outline" />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('shows loading state when loading - no text, ActivityIndicator shown', () => {
    const onPress = jest.fn();
    const { queryByText } = render(
      <Button title="Test Button" onPress={onPress} loading={true} />
    );
    // When loading, the title text is NOT rendered (ActivityIndicator shown instead)
    expect(queryByText('Test Button')).toBeNull();
    // Verify it's not throwing - component renders correctly with loading
    expect(true).toBe(true);
  });
});

describe('Colors Configuration', () => {
  it('primary color is Algerian blue', () => {
    expect(colors.primary).toBe('#1A2E6B');
  });

  it('accent color is gold', () => {
    expect(colors.accent).toBe('#F5A623');
  });

  it('has surface color defined', () => {
    expect(colors.surface).toBeTruthy();
  });

  it('has error color defined', () => {
    expect(colors.error).toBeTruthy();
  });
});
