import React, { useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ScrollView,
    Vibration,
} from 'react-native';
import {
    GestureDetector,
    Gesture,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import Toast from '../components/Toast';

const HINTS = [
    { icon: '☝️', label: 'Tap', pts: '+1 point' },
    { icon: '✌️', label: 'Double-tap', pts: '+2 points' },
    { icon: '✊', label: 'Long-press (3s)', pts: '+5 points' },
    { icon: '👋', label: 'Swipe', pts: '+1–10 random' },
    { icon: '🤏', label: 'Pinch', pts: '+3 points' },
];

export default function HomeScreen() {
    const { theme } = useTheme();
    const { state, addScore } = useGame();
    const [toastMsg, setToastMsg] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const btnScale = useRef(new Animated.Value(1)).current;
    const btnTranslateX = useRef(new Animated.Value(0)).current;
    const btnTranslateY = useRef(new Animated.Value(0)).current;
    const scoreScale = useRef(new Animated.Value(1)).current;

    const showToast = useCallback((msg: string) => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToastMsg(msg);
        setToastVisible(true);
        toastTimer.current = setTimeout(() => setToastVisible(false), 1800);
    }, []);

    const popScore = useCallback(() => {
        Animated.sequence([
            Animated.spring(scoreScale, { toValue: 1.2, useNativeDriver: true, speed: 50 }),
            Animated.spring(scoreScale, { toValue: 1, useNativeDriver: true, speed: 50 }),
        ]).start();
    }, [scoreScale]);

    const handleGesture = useCallback((type: string, pts: number, label: string) => {
        const challengeToast = addScore(pts, type);
        Vibration.vibrate(30);
        popScore();
        showToast(challengeToast || label);
    }, [addScore, popScore, showToast]);


    const singleTap = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(1)
        .runOnJS(true)
        .onEnd(() => {
            Animated.sequence([
                Animated.spring(btnScale, { toValue: 0.92, useNativeDriver: true, speed: 60 }),
                Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 40 }),
            ]).start();
            handleGesture('tap', 1, 'Tap! +1');
        });

    const doubleTap = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .runOnJS(true)
        .onEnd(() => {
            Animated.sequence([
                Animated.spring(btnScale, { toValue: 0.85, useNativeDriver: true, speed: 60 }),
                Animated.spring(btnScale, { toValue: 1.1, useNativeDriver: true, speed: 60 }),
                Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 40 }),
            ]).start();
            handleGesture('double', 2, 'Double tap! +2');
        });

    const longPress = Gesture.LongPress()
        .minDuration(3000)
        .runOnJS(true)
        .onStart(() => {
            Animated.spring(btnScale, { toValue: 1.15, useNativeDriver: true, speed: 20 }).start();
            handleGesture('long', 5, 'Long press! +5');
        })
        .onEnd(() => {
            Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
        });

    const pan = Gesture.Pan()
        .runOnJS(true)
        .onUpdate(e => {
            btnTranslateX.setValue(e.translationX);
            btnTranslateY.setValue(e.translationY);
        })
        .onEnd(() => {
            handleGesture('pan', 0, 'Object dragged!');
            Animated.parallel([
                Animated.spring(btnTranslateX, { toValue: 0, useNativeDriver: true, speed: 20 }),
                Animated.spring(btnTranslateY, { toValue: 0, useNativeDriver: true, speed: 20 }),
            ]).start();
        });

    const flingRight = Gesture.Fling()
        .direction(1)
        .runOnJS(true)
        .onEnd(() => {
            const pts = Math.floor(Math.random() * 10) + 1;
            handleGesture('swipe-right', pts, `Swipe right! +${pts}`);
        });

    const flingLeft = Gesture.Fling()
        .direction(2)
        .runOnJS(true)
        .onEnd(() => {
            const pts = Math.floor(Math.random() * 10) + 1;
            handleGesture('swipe-left', pts, `Swipe left! +${pts}`);
        });

    const pinch = Gesture.Pinch()
        .runOnJS(true)
        .onUpdate(e => {
            const clamped = Math.max(0.5, Math.min(2.0, e.scale));
            btnScale.setValue(clamped);
        })
        .onEnd(() => {
            handleGesture('pinch', 3, 'Pinch! +3');
            Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
        });

    const composed = Gesture.Simultaneous(
        Gesture.Exclusive(doubleTap, singleTap),
        Gesture.Race(flingRight, flingLeft),
        pan,
        pinch,
        longPress,
    );

    const s = makeStyles(theme);

    return (
        <GestureHandlerRootView style={s.container}>
            <View style={s.header}>
                <Text style={s.headerTitle}>≡  Gesture Clicker</Text>
                <Text style={s.headerIcon}>⌕</Text>
            </View>

            <View style={s.scoreSection}>
                <Text style={s.scoreLabel}>SCORE</Text>
                <Animated.Text style={[s.scoreValue, { transform: [{ scale: scoreScale }] }]}>
                    {state.score}
                </Animated.Text>
            </View>

            <ScrollView contentContainerStyle={s.scrollContent} bounces={false}>
                <View style={s.clickerArea}>
                    <Text style={[s.scaleLabel, { color: theme.textMuted }]}>
                        Scale: {state.scale.toFixed(2)}x
                    </Text>

                    <GestureDetector gesture={composed}>
                        <Animated.View
                            style={[
                                s.clicker,
                                {
                                    transform: [
                                        { scale: btnScale },
                                        { translateX: btnTranslateX },
                                        { translateY: btnTranslateY },
                                    ],
                                },
                            ]}
                        >
                            <Text style={s.clickerIcon}>☝️</Text>
                            <Text style={s.clickerLabel}>TAP ME</Text>
                        </Animated.View>
                    </GestureDetector>

                    <Text style={[s.gestureHint, { color: theme.textMuted }]}>
                        Tap · Double-tap · Long press (3s) · Swipe · Pinch
                    </Text>
                </View>

                <View style={[s.hintsCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                    {HINTS.map((h, i) => (
                        <View
                            key={h.label}
                            style={[
                                s.hintRow,
                                i < HINTS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.border },
                            ]}
                        >
                            <Text style={s.hintIcon}>{h.icon}</Text>
                            <Text style={[s.hintText, { color: theme.textMuted }]}>{h.label}</Text>
                            <Text style={[s.hintPts, { color: theme.text }]}>{h.pts}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <Toast message={toastMsg} visible={toastVisible} />
        </GestureHandlerRootView>
    );
}

const makeStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.bg },
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
        headerTitle: { fontSize: 18, fontWeight: '500', color: theme.text },
        headerIcon: { fontSize: 20, color: theme.textMuted },
        scoreSection: { backgroundColor: theme.scoreBg, paddingVertical: 28, alignItems: 'center' },
        scoreLabel: { fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', marginBottom: 6 },
        scoreValue: { fontSize: 56, fontWeight: '500', color: '#FFFFFF', lineHeight: 64 },
        scrollContent: { paddingBottom: 24 },
        clickerArea: { paddingVertical: 32, alignItems: 'center', gap: 16 },
        scaleLabel: { fontSize: 12 },
        clicker: {
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: '#3B82F6',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
        },
        clickerIcon: { fontSize: 36, marginBottom: 4 },
        clickerLabel: { fontSize: 11, letterSpacing: 1.5, fontWeight: '500', color: '#FFFFFF' },
        gestureHint: { fontSize: 12, textAlign: 'center', paddingHorizontal: 24 },
        hintsCard: { marginHorizontal: 16, borderRadius: 14, borderWidth: 0.5, paddingHorizontal: 18, paddingVertical: 8 },
        hintRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
        hintIcon: { fontSize: 18, width: 26 },
        hintText: { flex: 1, fontSize: 13 },
        hintPts: { fontSize: 13, fontWeight: '500' },
    });