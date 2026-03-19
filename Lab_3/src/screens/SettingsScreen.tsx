import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { state, resetGame } = useGame();
  const [animEnabled, setAnimEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const s = makeStyles(theme);

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress and score?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetGame },
      ]
    );
  };

  const completedChallenges = state.challenges.filter(c => c.current >= c.target).length;

  return (
    <View style={s.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={s.header}>
        <Text style={s.headerTitle}>⚙  Settings</Text>
        <Text style={s.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={s.content}>

        {/* Appearance */}
        <Text style={s.sectionTitle}>Appearance</Text>
        <View style={s.section}>
          <View style={s.row}>
            <Text style={s.rowIcon}>🌙</Text>
            <View style={s.rowText}>
              <Text style={[s.rowLabel, { color: theme.text }]}>Dark theme</Text>
              <Text style={[s.rowSub, { color: theme.textMuted }]}>Force dark mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[s.row, s.rowBorder]}>
            <Text style={s.rowIcon}>✨</Text>
            <View style={s.rowText}>
              <Text style={[s.rowLabel, { color: theme.text }]}>Animations</Text>
              <Text style={[s.rowSub, { color: theme.textMuted }]}>Score pop and ripple effects</Text>
            </View>
            <Switch
              value={animEnabled}
              onValueChange={setAnimEnabled}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[s.row, s.rowBorder]}>
            <Text style={s.rowIcon}>🔊</Text>
            <View style={s.rowText}>
              <Text style={[s.rowLabel, { color: theme.text }]}>Sound effects</Text>
              <Text style={[s.rowSub, { color: theme.textMuted }]}>Tap feedback sounds</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Statistics */}
        <Text style={s.sectionTitle}>Statistics</Text>
        <View style={s.section}>
          {[
            { icon: '🏆', label: 'High score', value: state.highScore },
            { icon: '⭐', label: 'Current score', value: state.score },
            { icon: '☝️', label: 'Total taps', value: state.taps },
            { icon: '✌️', label: 'Double taps', value: state.doubleTaps },
            { icon: '✊', label: 'Long presses', value: state.longPresses },
            { icon: '👋', label: 'Swipes', value: state.swipes },
            { icon: '🤏', label: 'Pinches', value: state.pinches },
            { icon: '✅', label: 'Challenges done', value: `${completedChallenges} / ${state.challenges.length}` },
          ].map((stat, i) => (
            <View key={stat.label} style={[s.row, i > 0 && s.rowBorder]}>
              <Text style={s.rowIcon}>{stat.icon}</Text>
              <Text style={[s.rowLabel, { color: theme.text, flex: 1 }]}>{stat.label}</Text>
              <View style={s.badge}>
                <Text style={[s.badgeText, { color: theme.accent }]}>{stat.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* About */}
        <Text style={s.sectionTitle}>About</Text>
        <View style={s.section}>
          <View style={s.row}>
            <Text style={s.rowIcon}>📱</Text>
            <View style={s.rowText}>
              <Text style={[s.rowLabel, { color: theme.text }]}>Gesture Clicker</Text>
              <Text style={[s.rowSub, { color: theme.textMuted }]}>Lab work #3 — React Native Gestures</Text>
            </View>
          </View>
          <View style={[s.row, s.rowBorder]}>
            <Text style={s.rowIcon}>🔖</Text>
            <Text style={[s.rowLabel, { color: theme.text, flex: 1 }]}>Version</Text>
            <View style={s.badge}>
              <Text style={[s.badgeText, { color: theme.accent }]}>1.0.0</Text>
            </View>
          </View>
          <View style={[s.row, s.rowBorder]}>
            <Text style={s.rowIcon}>🎓</Text>
            <View style={s.rowText}>
              <Text style={[s.rowLabel, { color: theme.text }]}>Tech stack</Text>
              <Text style={[s.rowSub, { color: theme.textMuted }]}>
                RN + RNGH + Reanimated + Navigation
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[s.resetBtn, { backgroundColor: theme.dangerLight }]} onPress={handleReset} activeOpacity={0.7}>
          <Text style={[s.resetText, { color: theme.danger }]}>Reset all progress</Text>
        </TouchableOpacity>

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
    content: {
      padding: 16,
      gap: 8,
      paddingBottom: 32,
    },
    sectionTitle: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      color: theme.textMuted,
      marginTop: 12,
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    section: {
      backgroundColor: theme.cardBg,
      borderRadius: 14,
      borderWidth: 0.5,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 14,
      gap: 12,
    },
    rowBorder: {
      borderTopWidth: 0.5,
      borderTopColor: theme.border,
    },
    rowIcon: {
      fontSize: 18,
      width: 26,
      textAlign: 'center',
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    rowLabel: {
      fontSize: 14,
    },
    rowSub: {
      fontSize: 12,
    },
    badge: {
      backgroundColor: theme.accentLight,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '500',
    },
    resetBtn: {
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 12,
    },
    resetText: {
      fontSize: 14,
      fontWeight: '500',
    },
  });
