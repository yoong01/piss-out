import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/colors';
import { PASSCODE_LOCKED_WARNING, PASSCODE_UNLOCKED_NOTE } from '../theme/copy';

interface PasscodeGateProps {
  unlocked: boolean;
  reviewsUntilUnlock: number;
  children: React.ReactNode;
}

export function PasscodeGate({ unlocked, reviewsUntilUnlock, children }: PasscodeGateProps) {
  if (!unlocked) {
    return (
      <View style={styles.lockedBox}>
        <Text style={styles.lockedTitle}>🔒 Classified</Text>
        <Text style={styles.lockedText}>{PASSCODE_LOCKED_WARNING}</Text>
        <Text style={styles.lockedCount}>
          {reviewsUntilUnlock} more review{reviewsUntilUnlock === 1 ? '' : 's'} to clearance.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {children}
      <Text style={styles.note}>{PASSCODE_UNLOCKED_NOTE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lockedBox: {
    backgroundColor: '#F4EFE2',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  lockedTitle: {
    fontWeight: '800',
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lockedText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  lockedCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: spacing.sm,
  },
  note: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});
