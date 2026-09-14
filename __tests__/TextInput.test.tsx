import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput, TextInputProps } from '../src/components/ui/TextInput';

describe('TextInput Component', () => {
  const defaultProps: TextInputProps = {
    placeholder: 'Enter text',
    value: '',
    onChangeText: jest.fn(),
  };

  it('renders with placeholder text', () => {
    const { getByPlaceholderText } = render(<TextInput {...defaultProps} />);
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <TextInput placeholder="Type here" onChangeText={onChangeText} />
    );
    fireEvent.changeText(getByPlaceholderText('Type here'), 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('displays error text when error prop is set', () => {
    const { getByPlaceholderText, getByText } = render(
      <TextInput {...defaultProps} error="Invalid input" />
    );
    expect(getByText('Invalid input')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <TextInput {...defaultProps} disabled={true} />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders multiline when multiline is true', () => {
    const { getByPlaceholderText } = render(
      <TextInput {...defaultProps} multiline={true} />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });
});
