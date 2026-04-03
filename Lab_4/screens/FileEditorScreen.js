import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, Animated,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { COLORS } from '../constants/theme';

export default function FileEditorScreen({ route, navigation }) {
  const { filePath, fileName } = route.params;
  const [content, setContent] = useState('');
  const [original, setOriginal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const dirtyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    FileSystem.readAsStringAsync(filePath)
      .then(text => { setContent(text); setOriginal(text); })
      .catch(() => { setContent(''); setOriginal(''); })
      .finally(() => setLoading(false));
  }, []);

  const markDirty = useCallback((val) => {
    setIsDirty(val);
    Animated.spring(dirtyAnim, { toValue: val ? 1 : 0, useNativeDriver: true, speed: 20 }).start();
  }, []);

  const handleChange = (text) => {
    setContent(text);
    markDirty(text !== original);
  };

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await FileSystem.writeAsStringAsync(filePath, content);
      setOriginal(content);
      markDirty(false);
      Alert.alert('✅ Збережено', `"${fileName}" успішно збережено.`, [
        { text: 'OK' },
      ]);
    } catch (e) {
      Alert.alert('Помилка збереження', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      Alert.alert(
        '⚠️ Незбережені зміни',
        'Є незбережені зміни. Що зробити?',
        [
          { text: 'Зберегти', onPress: async () => { await handleSave(); navigation.goBack(); } },
          { text: 'Не зберігати', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Скасувати', style: 'cancel' },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleReset = () => {
    Alert.alert('Скасувати зміни?', 'Повернути файл до збереженого стану?', [
      { text: 'Ні', style: 'cancel' },
      { text: 'Так', onPress: () => { setContent(original); markDirty(false); } },
    ]);
  };

  const lineCount = content.split('\n').length;
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const dotColor = dirtyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.green, COLORS.orange],
  });

  return (
    <KeyboardAvoidingView
      style={ss.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={ss.header}>
        <TouchableOpacity style={ss.headerBtn} onPress={handleBack}>
          <Text style={ss.headerBtnTxt}>←</Text>
        </TouchableOpacity>

        <View style={ss.headerCenter}>
          <Text style={ss.fileName} numberOfLines={1}>{fileName}</Text>
          <Animated.View style={[ss.dirtyDot, { backgroundColor: dotColor }]} />
        </View>

        {isDirty && (
          <TouchableOpacity style={ss.resetBtn} onPress={handleReset}>
            <Text style={ss.resetBtnTxt}>↺</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[ss.saveBtn, (!isDirty || saving) && ss.saveBtnOff]}
          onPress={handleSave}
          disabled={!isDirty || saving}
        >
          {saving
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={ss.saveBtnTxt}>💾  Зберегти</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={ss.toolbar}>
        <ToolStat label="Рядки" value={lineCount} />
        <ToolStat label="Слова" value={wordCount} />
        <ToolStat label="Симв." value={charCount} />
        <View style={ss.toolbarSep} />
        {isDirty ? (
          <View style={ss.unsavedTag}>
            <Text style={ss.unsavedTxt}>● НЕЗБЕРЕЖЕНО</Text>
          </View>
        ) : (
          <View style={ss.savedTag}>
            <Text style={ss.savedTxt}>✓ ЗБЕРЕЖЕНО</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={ss.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={ss.loadingTxt}>Завантаження...</Text>
        </View>
      ) : (
        <TextInput
          style={ss.editor}
          value={content}
          onChangeText={handleChange}
          multiline
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          scrollEnabled
          placeholder="Файл порожній. Почніть вводити текст..."
          placeholderTextColor={COLORS.textMuted}
          selectionColor={COLORS.accent}
          onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const ToolStat = ({ label, value }) => (
  <View style={ss.toolStat}>
    <Text style={ss.toolStatVal}>{value}</Text>
    <Text style={ss.toolStatLabel}> {label}</Text>
  </View>
);

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
  },
  headerBtnTxt: { color: COLORS.accent, fontSize: 18, fontWeight: '600' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  fileName: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', flex: 1 },
  dirtyDot: { width: 9, height: 9, borderRadius: 5 },
  resetBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
  },
  resetBtnTxt: { color: COLORS.orange, fontSize: 20, fontWeight: '500' },
  saveBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 12, minWidth: 100, alignItems: 'center',
    shadowColor: COLORS.accent, shadowOpacity: 0.4,
    shadowRadius: 8, elevation: 4,
  },
  saveBtnOff: { backgroundColor: COLORS.border, shadowOpacity: 0, elevation: 0 },
  saveBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '800' },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 16,
  },
  toolStat: { flexDirection: 'row', alignItems: 'baseline' },
  toolStatVal: { color: COLORS.accent, fontSize: 14, fontWeight: '800' },
  toolStatLabel: { color: COLORS.textMuted, fontSize: 11 },
  toolbarSep: { flex: 1 },
  unsavedTag: {
    backgroundColor: COLORS.orange + '20',
    borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8,
    borderWidth: 1, borderColor: COLORS.orange + '50',
  },
  unsavedTxt: { color: COLORS.orange, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  savedTag: {
    backgroundColor: COLORS.green + '15',
    borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8,
    borderWidth: 1, borderColor: COLORS.green + '40',
  },
  savedTxt: { color: COLORS.green, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingTxt: { color: COLORS.textSecondary, marginTop: 12 },

  editor: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 22,
    padding: 16,
    textAlignVertical: 'top',
    backgroundColor: COLORS.codeBg,
  },
});
