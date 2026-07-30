import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface StarRowProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

const MAX_STARS = 5;

export function StarRow({ value, onChange, size = 20 }: StarRowProps) {
  const stars = Array.from({ length: MAX_STARS }, (_, i) => i + 1);
  const interactive = !!onChange;

  return (
    <View style={styles.row}>
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        const filledColor = interactive ? colors.point : colors.black;
        const content = (
          <Text style={{ fontSize: size, color: filled ? filledColor : colors.border }}>
            {filled ? '★' : '☆'}
          </Text>
        );
        if (!interactive) {
          return <View key={star}>{content}</View>;
        }
        return (
          <Pressable key={star} onPress={() => onChange?.(star)} hitSlop={6}>
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
});
