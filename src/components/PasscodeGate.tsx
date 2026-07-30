import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/colors';
import { PASSCODE_LOCKED_WARNING, PASSCODE_UNLOCKED_NOTE } from '../theme/copy';
import { fonts } from '../theme/typography';

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
    backgroundColor: colors.black,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  lockedTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.point,
    marginBottom: spacing.xs,
  },
  lockedText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.white,
    lineHeight: 17,
  },
  lockedCount: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.point,
    marginTop: spacing.sm,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
