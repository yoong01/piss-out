import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors, radii } from '../theme/colors';

interface BottomSheetProps {
  visible: boolean;
  openToken: string | null;
  onClose: () => void;
  children: React.ReactNode;
}

const EXPANDED_RATIO = 0.9;
const COLLAPSED_RATIO = 0.55;
const CLOSE_DRAG_PX = 90;
const EXPAND_DRAG_PX = 60;
const FLING_VELOCITY = 1.1;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function BottomSheet({ visible, openToken, onClose, children }: BottomSheetProps) {
  const { height: screenHeight } = useWindowDimensions();

  const sheetHeight = screenHeight * EXPANDED_RATIO;
  const collapsedTranslate = sheetHeight - screenHeight * COLLAPSED_RATIO;
  const expandedTranslate = 0;
  const hiddenTranslate = sheetHeight;

  const translateY = useRef(new Animated.Value(hiddenTranslate)).current;
  const dragStartValue = useRef(collapsedTranslate);

  useEffect(() => {
    if (visible) {
      translateY.setValue(hiddenTranslate);
      Animated.spring(translateY, {
        toValue: collapsedTranslate,
        useNativeDriver: true,
        damping: 20,
        stiffness: 220,
        mass: 0.9,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, openToken]);

  function snapTo(value: number) {
    Animated.spring(translateY, {
      toValue: value,
      useNativeDriver: true,
      damping: 20,
      stiffness: 220,
      mass: 0.9,
    }).start();
  }

  function closeSheet() {
    Animated.timing(translateY, {
      toValue: hiddenTranslate,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
        onPanResponderGrant: () => {
          translateY.stopAnimation((value) => {
            dragStartValue.current = value;
          });
        },
        onPanResponderMove: (_, gesture) => {
          const next = clamp(dragStartValue.current + gesture.dy, expandedTranslate, hiddenTranslate);
          translateY.setValue(next);
        },
        onPanResponderRelease: (_, gesture) => {
          const current = clamp(dragStartValue.current + gesture.dy, expandedTranslate, hiddenTranslate);
          if (current > collapsedTranslate + CLOSE_DRAG_PX || gesture.vy > FLING_VELOCITY) {
            closeSheet();
          } else if (current < collapsedTranslate - EXPAND_DRAG_PX || gesture.vy < -FLING_VELOCITY) {
            snapTo(expandedTranslate);
          } else {
            snapTo(collapsedTranslate);
          }
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collapsedTranslate, expandedTranslate, hiddenTranslate]
  );

  const backdropOpacity = translateY.interpolate({
    inputRange: [expandedTranslate, collapsedTranslate, hiddenTranslate],
    outputRange: [0.55, 0.4, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
      </Animated.View>

      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[
          styles.sheet,
          {
            height: sheetHeight,
            transform: [{ translateY }],
          },
        ]}
      >
        <View {...panResponder.panHandlers}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>
        </View>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
  },
});
