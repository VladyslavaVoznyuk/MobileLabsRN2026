import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {
  COLORS, getFileIcon, getFileTypeName, getExt,
  formatSize, formatDate, isTextFile,
} from '../constants/theme';

const Row = ({ icon, label, value, valueStyle, selectable }) => (
  <View style={ss.row}>
    <Text style={ss.rowIcon}>{icon}</Text>
    <View style={ss.rowBody}>
      <Text style={ss.rowLabel}>{label}</Text>
      <Text style={[ss.rowVal, valueStyle]} selectable={selectable}>{value ?? '—'}</Text>
    </View>
  </View>
);

export default function FileInfoScreen({ route, navigation }) {
  const { fileInfo } = route.params;
  const [info, setInfo] = useState(fileInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FileSystem.getInfoAsync(fileInfo.uri, { size: true })
      .then(res => setInfo({ ...fileInfo, ...res, isDir: res.isDirectory }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const { name, uri, isDir, size, modificationTime, exists } = info;
  const ext = getExt(name);
  const typeName = getFileTypeName(name, isDir);
  const icon = getFileIcon(name, isDir);
  const canEdit = !isDir && isTextFile(name);

  return (
    <View style={ss.container}>
      {/* Header */}
      <View style={ss.header}>
        <TouchableOpacity style={ss.backBtn} onPress={() => navigation.goBack()}>
          <Text style={ss.backBtnTxt}>←</Text>
        </TouchableOpacity>
        <Text style={ss.headerTitle}>Деталі файлу</Text>
        {canEdit && (
          <TouchableOpacity
            style={ss.editBtn}
            onPress={() => navigation.navigate('FileEditor', { filePath: uri, fileName: name })}
          >
            <Text style={ss.editBtnTxt}>✏️  Редагувати</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={ss.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={ss.content}>

          {/* Hero card */}
          <View style={ss.heroCard}>
            <View style={[ss.heroIcon, isDir ? ss.heroIconDir : ss.heroIconFile]}>
              <Text style={ss.heroIconTxt}>{icon}</Text>
            </View>
            <Text style={ss.heroName}>{name}</Text>
            <View style={ss.heroType}>
              <Text style={ss.heroTypeTxt}>{typeName}</Text>
            </View>
            {!isDir && !exists && (
              <View style={ss.heroMissing}>
                <Text style={ss.heroMissingTxt}>⚠️ Файл не знайдено</Text>
              </View>
            )}
          </View>

          <View style={ss.card}>
            <Text style={ss.cardTitle}>АТРИБУТИ</Text>

            <Row icon="🏷️" label="Назва" value={name} selectable />
            <View style={ss.divider} />
            <Row icon="📂" label="Тип" value={typeName} valueStyle={{ color: COLORS.cyan }} />
            <View style={ss.divider} />
            <Row icon="🔤" label="Розширення" value={ext ? `.${ext.toUpperCase()}` : '(немає)'} />
            {!isDir && (
              <>
                <View style={ss.divider} />
                <Row
                  icon="⚖️"
                  label="Розмір"
                  value={
                    size !== undefined
                      ? `${formatSize(size)}\n(${size?.toLocaleString('uk-UA') ?? 0} байт)`
                      : '—'
                  }
                  valueStyle={{ color: COLORS.green }}
                />
              </>
            )}
            <View style={ss.divider} />
            <Row
              icon="🕐"
              label="Остання зміна"
              value={formatDate(modificationTime)}
              valueStyle={{ color: COLORS.accent }}
            />
            <View style={ss.divider} />
            <Row
              icon={exists !== false ? '✅' : '❌'}
              label="Стан"
              value={exists !== false ? 'Існує' : 'Не знайдено'}
            />
          </View>

          <View style={ss.card}>
            <Text style={ss.cardTitle}>ШЛЯХ</Text>
            <Text style={ss.pathTxt} selectable>{uri}</Text>
          </View>

          <View style={ss.actionsCard}>
            {canEdit && (
              <TouchableOpacity
                style={ss.actionRow}
                onPress={() => navigation.navigate('FileViewer', { filePath: uri, fileName: name })}
              >
                <Text style={ss.actionRowIcon}>👁️</Text>
                <Text style={ss.actionRowTxt}>Переглянути вміст</Text>
                <Text style={ss.actionRowArr}>›</Text>
              </TouchableOpacity>
            )}
            {canEdit && (
              <>
                <View style={ss.divider} />
                <TouchableOpacity
                  style={ss.actionRow}
                  onPress={() => navigation.navigate('FileEditor', { filePath: uri, fileName: name })}
                >
                  <Text style={ss.actionRowIcon}>✏️</Text>
                  <Text style={ss.actionRowTxt}>Редагувати файл</Text>
                  <Text style={ss.actionRowArr}>›</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

        </ScrollView>
      )}
    </View>
  );
}

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
    gap: 10,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
  },
  backBtnTxt: { color: COLORS.accent, fontSize: 18, fontWeight: '600' },
  headerTitle: { flex: 1, color: COLORS.textPrimary, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  editBtn: {
    backgroundColor: COLORS.accent, borderRadius: 20,
    paddingVertical: 7, paddingHorizontal: 13,
  },
  editBtnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  content: { padding: 16, gap: 14 },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  heroIcon: {
    width: 90, height: 90, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  heroIconDir: { backgroundColor: '#1E1A40' },
  heroIconFile: { backgroundColor: '#0F1A2A' },
  heroIconTxt: { fontSize: 48 },
  heroName: {
    color: COLORS.textPrimary, fontSize: 18, fontWeight: '800',
    textAlign: 'center', marginBottom: 10,
  },
  heroType: {
    backgroundColor: COLORS.accent + '22',
    borderRadius: 20, paddingVertical: 5, paddingHorizontal: 16,
    borderWidth: 1, borderColor: COLORS.accent + '44',
  },
  heroTypeTxt: { color: COLORS.accent, fontSize: 12, fontWeight: '700' },
  heroMissing: {
    marginTop: 10,
    backgroundColor: COLORS.red + '20',
    borderRadius: 10, paddingVertical: 4, paddingHorizontal: 12,
    borderWidth: 1, borderColor: COLORS.red + '40',
  },
  heroMissingTxt: { color: COLORS.red, fontSize: 12, fontWeight: '600' },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: {
    color: COLORS.textMuted, fontSize: 9, letterSpacing: 2,
    fontWeight: '800', marginBottom: 14,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },

  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rowIcon: { fontSize: 16, marginTop: 1, width: 22, textAlign: 'center' },
  rowBody: { flex: 1 },
  rowLabel: { color: COLORS.textMuted, fontSize: 11, marginBottom: 2 },
  rowVal: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },

  pathTxt: {
    color: COLORS.textSecondary, fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },

  actionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
  },
  actionRowIcon: { fontSize: 18 },
  actionRowTxt: { flex: 1, color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  actionRowArr: { color: COLORS.textMuted, fontSize: 20 },
});
