import React, {useMemo, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {SafeAreaContext} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {spacing, borderRadius, typography, shadows} from '../../config/theme';

export type HeaderTitleAlign = 'center' | 'left' | 'right';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAction?: () => void;
  rightAction?: () => void;
  rightPress?: () => void;
  centerAction?: () => void;
  backgroundColor?: string;
  tintColor?: string;
  titleAlign?: HeaderTitleAlign;
  style?: ViewStyle;
  transparent?: boolean;
  onRightPress?: () => void;
}

const useSafeArea = () => {
  const ctx = useContext(SafeAreaContext);
  return (ctx as {top?: number} | undefined)?.top ?? 0;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  leftAction,
  rightAction,
  rightPress,
  centerAction,
  backgroundColor = colors.primary,
  tintColor = colors.textOnPrimary,
  titleAlign = 'center',
  style,
  transparent = false,
}) => {
  const top = useSafeArea();
  const headerHeight = top + 50;
  const effectiveRightAction = rightPress ?? rightAction;

  const content = useMemo(() => {
    if (titleAlign === 'left') {
      return (
        <View style={styles.row}>
          <View style={styles.leftContainer}>
            {leftIcon && <View style={styles.iconWrap}>{leftIcon}</View>}
            {(!leftIcon && leftAction) && (
              <TouchableOpacity onPress={leftAction} style={styles.iconButton}>
                <Text style={[styles.iconText, {color: tintColor}]}>☰</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.centerContainer}>
            {title && (
              <View>
                <Text style={[styles.title, {color: tintColor}]}>{title}</Text>
                {subtitle && <Text style={[styles.subtitle, {color: tintColor}]}>{subtitle}</Text>}
              </View>
            )}
          </View>
          {rightIcon && (
            <View style={styles.rightContainer}>
              {effectiveRightAction ? (
                <TouchableOpacity onPress={effectiveRightAction}>
                  <View style={styles.iconWrap}>{rightIcon}</View>
                </TouchableOpacity>
              ) : (
                <View style={styles.iconWrap}>{rightIcon}</View>
              )}
            </View>
          )}
          {!rightIcon && effectiveRightAction && (
            <TouchableOpacity onPress={effectiveRightAction} style={styles.iconButton}>
              <Text style={[styles.iconText, {color: tintColor}]}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (titleAlign === 'right') {
      return (
        <View style={styles.row}>
          <View style={styles.leftContainer}>
            {leftIcon && <View style={styles.iconWrap}>{leftIcon}</View>}
            {(!leftIcon && leftAction) && (
              <TouchableOpacity onPress={leftAction} style={styles.iconButton}>
                <Text style={[styles.iconText, {color: tintColor}]}>☰</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.centerContainer}>
            {title && <Text style={[styles.title, {color: tintColor}]}>{title}</Text>}
            {subtitle && <Text style={[styles.subtitle, {color: tintColor}]}>{subtitle}</Text>}
          </View>
          {rightIcon && (
            <View style={styles.rightContainer}>
              {effectiveRightAction ? (
                <TouchableOpacity onPress={effectiveRightAction}>
                  <View style={styles.iconWrap}>{rightIcon}</View>
                </TouchableOpacity>
              ) : (
                <View style={styles.iconWrap}>{rightIcon}</View>
              )}
            </View>
          )}
          {!rightIcon && effectiveRightAction && (
            <TouchableOpacity onPress={effectiveRightAction} style={styles.iconButton}>
              <Text style={[styles.iconText, {color: tintColor}]}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // center (default)
    return (
      <View style={styles.row}>
        <View style={styles.leftContainer}>
          {leftIcon && <View style={styles.iconWrap}>{leftIcon}</View>}
          {(!leftIcon && leftAction) && (
            <TouchableOpacity onPress={leftAction} style={styles.iconButton}>
              <Text style={[styles.iconText, {color: tintColor}]}>☰</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.centerContainer, styles.titleContainerCenter]}>
          {title && (
            <TouchableOpacity onPress={centerAction} disabled={!centerAction}>
              <View>
                <Text style={[styles.title, {color: tintColor}]}>{title}</Text>
                {subtitle && <Text style={[styles.subtitle, {color: tintColor}]}>{subtitle}</Text>}
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.rightContainer}>
          {rightIcon && (
            <View style={styles.iconWrap}>
              {effectiveRightAction ? (
                <TouchableOpacity onPress={effectiveRightAction}>{rightIcon}</TouchableOpacity>
              ) : (
                rightIcon
              )}
            </View>
          )}
          {!rightIcon && effectiveRightAction && (
            <TouchableOpacity onPress={effectiveRightAction} style={styles.iconButton}>
              <Text style={[styles.iconText, {color: tintColor}]}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }, [title, subtitle, leftIcon, rightIcon, leftAction, effectiveRightAction, centerAction, tintColor, titleAlign]);

  return (
    <View
      style={[
        styles.headerContainer,
        {backgroundColor: transparent ? undefined : backgroundColor},
        {height: headerHeight},
        style,
      ]}>
      {transparent ? (
        <View style={Platform.OS === 'ios' ? {marginTop: top} : {}}>
          {content}
        </View>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 50,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainerCenter: {
    width: '100%',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  iconText: {
    fontSize: 22,
    lineHeight: 22,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.85,
  },
});
