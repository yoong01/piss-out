import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PasscodeGate } from '../components/PasscodeGate';
import { RatingCategoryInput } from '../components/RatingCategoryInput';
import { useAppStore } from '../data/store';
import { RATING_CATEGORY_ORDER, RatingCategories, RatingCategoryKey } from '../data/types';
import { colors, radii, spacing } from '../theme/colors';
import { randomFrom, REVIEW_SUBMIT_SUCCESS_LINES } from '../theme/copy';
import { computeRank } from '../utils/rankEngine';
import { useSoundEffects } from '../utils/sound';
import { FindStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<FindStackParamList, 'AddReview'>;

function defaultRatings(): RatingCategories {
  return RATING_CATEGORY_ORDER.reduce((acc, key) => {
    acc[key] = 3;
    return acc;
  }, {} as RatingCategories);
}

export function AddReviewScreen({ route, navigation }: Props) {
  const { locationId } = route.params;
  const location = useAppStore((s) => s.locations.find((l) => l.id === locationId));
  const addReview = useAppStore((s) => s.addReview);
  const reviews = useAppStore((s) => s.reviews);
  const profile = useAppStore((s) => s.profile);
  const { playFlush } = useSoundEffects();

  const [ratings, setRatings] = useState<RatingCategories>(defaultRatings());
  const [comment, setComment] = useState('');
  const [hasPasscode, setHasPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');

  const rank = computeRank(reviews, profile.passcodesShared);

  const updateRating = (key: RatingCategoryKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    addReview({
      locationId,
      ratings,
      comment: comment.trim(),
      hasPasscode: hasPasscode && rank.passcodeAccessUnlocked,
      passcode: hasPasscode && rank.passcodeAccessUnlocked ? passcode.trim() : undefined,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    playFlush();
    Alert.alert(randomFrom(REVIEW_SUBMIT_SUCCESS_LINES), undefined, [
      { text: 'Roger that', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>File a Report</Text>
          <Text style={styles.subtitle}>{location?.name}</Text>

          {RATING_CATEGORY_ORDER.map((key) => (
            <RatingCategoryInput
              key={key}
              category={key}
              value={ratings[key]}
              onChange={(v) => updateRating(key, v)}
            />
          ))}

          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Anything else the squad should know?"
            placeholderTextColor={colors.textMuted}
            multiline
            value={comment}
            onChangeText={setComment}
          />

          <View style={styles.passcodeHeader}>
            <Text style={styles.sectionTitle}>Share a door code?</Text>
            <Switch
              value={hasPasscode}
              onValueChange={setHasPasscode}
              disabled={!rank.passcodeAccessUnlocked}
            />
          </View>

          {hasPasscode && (
            <PasscodeGate
              unlocked={rank.passcodeAccessUnlocked}
              reviewsUntilUnlock={rank.reviewsUntilPasscodeAccess}
            >
              <TextInput
                style={styles.passcodeInput}
                placeholder="e.g. 4821"
                placeholderTextColor={colors.textMuted}
                value={passcode}
                onChangeText={setPasscode}
                autoCapitalize="characters"
              />
            </PasscodeGate>
          )}

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Report</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  commentInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 13,
    color: colors.text,
    marginTop: spacing.xs,
  },
  passcodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  passcodeInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  submitButton: {
    backgroundColor: colors.success,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitText: { color: colors.surface, fontWeight: '800', fontSize: 16 },
});
