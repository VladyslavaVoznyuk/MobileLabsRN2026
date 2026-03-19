import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';

const CHALLENGE_COLORS: Record<string, string> = {
  c1: '#DBEAFE',
  c2: '#EDE9FE',
  c3: '#FCE7F3',
  c4: '#D1FAE5',
  c5: '#FEF9C3',
  c6: '#FEF9C3',
  c7: '#F3E8FF',
  c8: '#FEF3C7',
  c9: '#E0F2FE',
};

const CHALLENGE_COLORS_DARK: Record<string, string> = {
  c1: '#1E3A5F',
  c2: '#2E1B5E',
  c3: '#500A3A',
  c4: '#064E3B',
  c5: '#422006',
  c6: '#422006',
  c7: '#3B0764',
  c8: '#451A03',
  c9: '#0C4A6E',
};

export default function ChallengesScreen() {
  const { theme } = useTheme();
  const { state } = useGame();
  const s = makeStyles(theme);

  const completedCount = state.challenges.filter(c => c.current >= c.target).length;

  return (
    <View style={s.container}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      <View style={s.header}>
        <Text style={s.headerTitle}>≡  Challenges</Text>
        <Text style={s.headerIcon}>⌕</Text>
      </View>

      <View style={s.summaryBar}>
        <Text style={s.summaryText}>
          {completedCount} / {state.challenges.length} completed
        </Text>
        <View style={s.summaryProgress}>
          <View
            style={[
              s.summaryBar2,
              { width: `${(completedCount / state.challenges.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.list}>
        {state.challenges.map(ch => {
          const done = ch.current >= ch.target;
          const pct = Math.min(100, Math.round((ch.current / ch.target) * 100));
          const bgColor = theme.isDark ? CHALLENGE_COLORS_DARK[ch.id] : CHALLENGE_COLORS[ch.id];

          return (
            <View
              key={ch.id}
              style={[
                s.item,
                done && { borderColor: theme.success },
              ]}
            >
              <View style={[s.iconBox, { backgroundColor: bgColor }]}>
                <Text style={s.iconText}>{ch.icon}</Text>
              </View>

              <View style={s.itemBody}>
                <Text style={[s.itemTitle, { color: theme.text }]}>{ch.title}</Text>
                <Text style={[s.itemDesc, { color: theme.textMuted }]}>{ch.desc}</Text>

                <View style={s.progressTrack}>
                  <View style={[s.progressBar, { width: `${pct}%` }]} />
                </View>
                <Text style={[s.progressText, { color: theme.textMuted }]}>
                  {ch.current} / {ch.target}
                </Text>
              </View>

              <View style={[s.checkCircle, done && { backgroundColor: theme.success, borderColor: theme.success }]}>
                {done && <Text style={s.checkMark}>✓</Text>}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
    },
    header: {
      backgroundColor: theme.cardBg,
      paddingHorizontal: 20,
      paddingVertical: 14,
      paddingTop: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.text,
    },
    headerIcon: {
      fontSize: 20,
      color: theme.textMuted,
    },
    summaryBar: {
      backgroundColor: theme.cardBg,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.border,
      gap: 6,
    },
    summaryText: {
      fontSize: 13,
      color: theme.textMuted,
    },
    summaryProgress: {
      height: 4,
      backgroundColor: theme.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    summaryBar2: {
      height: 4,
      backgroundColor: theme.accent,
      borderRadius: 2,
    },
    list: {
      padding: 16,
      gap: 10,
    },
    item: {
      backgroundColor: theme.cardBg,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: theme.border,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    iconText: {
      fontSize: 22,
    },
    itemBody: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 2,
    },
    itemDesc: {
      fontSize: 12,
      marginBottom: 6,
    },
    progressTrack: {
      height: 4,
      backgroundColor: theme.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBar: {
      height: 4,
      backgroundColor: '#3B82F6',
      borderRadius: 2,
    },
    progressText: {
      fontSize: 11,
      marginTop: 4,
    },
    checkCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1.5,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    checkMark: {
      fontSize: 13,
      color: '#FFFFFF',
      fontWeight: '700',
    },
  });
