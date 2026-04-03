import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Platform,
  Animated,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { COLORS, formatSize } from '../constants/theme';

export default function FileViewerScreen({ route, navigation }) {
  const { filePath, fileName } = route.params;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    FileSystem.readAsStringAsync(filePath)
      .then(text => {
        setContent(text);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const lines = content.split('\n');
  const lineCount = lines.length;
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const ext = fileName.split('.').pop().toLowerCase();

  return (
    <View style={ss.container}>
      <View style={ss.header}>
        <TouchableOpacity style={ss.backBtn} onPress={() => navigation.goBack()}>
          <Text style={ss.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={ss.headerCenter}>
          <Text style={ss.headerTitle} numberOfLines={1}>{fileName}</Text>
          <View style={ss.extBadge}><Text style={ss.extBadgeText}>.{ext.toUpperCase()}</Text></View>
        </View>
        <TouchableOpacity
          style={ss.editBtn}
          onPress={() => navigation.navigate('FileEditor', { filePath, fileName })}
        >
          <Text style={ss.editBtnText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ss.infoBtn}
          onPress={() => navigation.navigate('FileInfo', {
            fileInfo: { name: fileName, uri: filePath, isDir: false }
          })}
        >
          <Text style={ss.editBtnText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {!loading && !error && (
        <View style={ss.statsBar}>
          <StatPill label="Рядки" value={lineCount} color={COLORS.cyan} />
          <StatPill label="Слова" value={wordCount} color={COLORS.green} />
          <StatPill label="Символи" value={charCount} color={COLORS.accent} />
          <StatPill label="Розмір" value={formatSize(charCount)} color={COLORS.orange} />
        </View>
      )}

      {loading ? (
        <View style={ss.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={ss.loadingTxt}>Читання файлу...</Text>
        </View>
      ) : error ? (
        <View style={ss.centered}>
          <Text style={ss.errorIcon}>⚠️</Text>
          <Text style={ss.errorTxt}>Помилка читання файлу</Text>
          <Text style={ss.errorDetail}>{error}</Text>
        </View>
      ) : (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <ScrollView
            style={ss.scroll}
            contentContainerStyle={ss.scrollContent}
            horizontal={false}
          >
            {content === '' ? (
              <View style={ss.emptyFile}>
                <Text style={ss.emptyFileTxt}>( порожній файл )</Text>
              </View>
            ) : (
              <View style={ss.codeBlock}>
                <View style={ss.lineNums}>
                  {lines.map((_, i) => (
                    <Text key={i} style={ss.lineNum}>{i + 1}</Text>
                  ))}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator>
                  <Text style={ss.code} selectable>{content}</Text>
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const StatPill = ({ label, value, color }) => (
  <View style={ss.statPill}>
    <Text style={[ss.statPillVal, { color }]}>{value}</Text>
    <Text style={ss.statPillLabel}>{label}</Text>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  backBtn: {
    width: 38, height: 38,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  backBtnText: { color: COLORS.accent, fontSize: 18, fontWeight: '600' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', flex: 1 },
  extBadge: {
    backgroundColor: COLORS.accent + '25',
    borderRadius: 7, paddingVertical: 3, paddingHorizontal: 8,
    borderWidth: 1, borderColor: COLORS.accent + '40',
  },
  extBadgeText: { color: COLORS.accent, fontSize: 10, fontWeight: '800' },
  editBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: COLORS.accentDim,
    justifyContent: 'center', alignItems: 'center',
  },
  infoBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
  },
  editBtnText: { fontSize: 18 },

  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 6,
  },
  statPill: {
    flex: 1, alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statPillVal: { fontSize: 14, fontWeight: '800' },
  statPillLabel: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 0.5, marginTop: 1 },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingTxt: { color: COLORS.textSecondary, marginTop: 12 },
  errorIcon: { fontSize: 42, marginBottom: 12 },
  errorTxt: { color: COLORS.red, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  errorDetail: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', paddingHorizontal: 30 },

  scroll: { flex: 1 },
  scrollContent: { padding: 14 },
  codeBlock: {
    flexDirection: 'row',
    backgroundColor: COLORS.codeBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  lineNums: {
    paddingVertical: 16, paddingHorizontal: 10,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1, borderRightColor: COLORS.border,
    alignItems: 'flex-end', minWidth: 42,
  },
  lineNum: {
    color: COLORS.textMuted, fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  code: {
    color: COLORS.textPrimary, fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20, padding: 16,
  },
  emptyFile: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyFileTxt: { color: COLORS.textMuted, fontSize: 14, fontStyle: 'italic' },
});
