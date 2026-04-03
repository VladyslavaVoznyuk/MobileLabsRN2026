import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, Modal, TextInput, ActivityIndicator,
  RefreshControl, Platform, Animated, Keyboard,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import {
  COLORS, getFileIcon, getFileTypeName, isTextFile,
  formatSize, formatDate, getExt,
} from '../constants/theme';

const StorageBar = ({ used, total }) => {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const color = pct > 85 ? COLORS.red : pct > 65 ? COLORS.orange : COLORS.green;
  return (
    <View style={ss.barBg}>
      <View style={[ss.barFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
};

const Breadcrumb = ({ history, currentPath, onNavigate }) => {
  const base = FileSystem.documentDirectory || '';
  const rel = currentPath.replace(base, '');
  const parts = ['Documents', ...rel.split('/').filter(Boolean)];

  return (
    <View style={ss.breadcrumbRow}>
      {parts.map((part, i) => {
        const isLast = i === parts.length - 1;
        return (
          <React.Fragment key={i}>
            <TouchableOpacity
              disabled={isLast}
              onPress={() => {
                if (isLast) return;
                const steps = parts.length - 1 - i;
                onNavigate(steps);
              }}
            >
              <Text style={[ss.crumb, isLast && ss.crumbActive]} numberOfLines={1}>
                {part}
              </Text>
            </TouchableOpacity>
            {!isLast && <Text style={ss.crumbSep}> / </Text>}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const FileItem = React.memo(({ item, onPress, onEdit, onInfo, onDelete }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  const ext = getExt(item.name);
  const isText = isTextFile(item.name);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={ss.fileItem}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[ss.iconWrap, item.isDir ? ss.iconDir : ss.iconFile]}>
          <Text style={ss.iconText}>{getFileIcon(item.name, item.isDir)}</Text>
        </View>

        <View style={ss.fileInfo}>
          <Text style={ss.fileName} numberOfLines={1}>{item.name}</Text>
          <Text style={ss.fileMeta}>
            {item.isDir ? 'Директорія' : formatSize(item.size)}
            {item.modificationTime ? '  ·  ' + formatDate(item.modificationTime) : ''}
          </Text>
          {!item.isDir && ext && (
            <View style={ss.extPill}>
              <Text style={ss.extPillText}>.{ext.toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={ss.actions}>
          {isText && !item.isDir && (
            <TouchableOpacity style={ss.actionBtn} onPress={onEdit}>
              <Text style={ss.actionIcon}>✏️</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={ss.actionBtn} onPress={onInfo}>
            <Text style={ss.actionIcon}>ℹ️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ss.actionBtn, ss.actionDel]} onPress={onDelete}>
            <Text style={ss.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const CreateModal = ({ visible, type, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const isFolder = type === 'folder';

  const reset = () => { setName(''); setContent(''); };
  const handleClose = () => { reset(); onClose(); };
  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) { Alert.alert('⚠️ Помилка', 'Введіть назву'); return; }
    onCreate(trimmed, content);
    reset();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableOpacity style={ss.overlay} activeOpacity={1} onPress={handleClose} />
      <View style={ss.sheet}>
        <View style={ss.sheetHandle} />
        <Text style={ss.sheetTitle}>
          {isFolder ? '📁  Нова папка' : '📄  Новий файл'}
        </Text>

        <Text style={ss.label}>{isFolder ? 'Назва папки' : "Ім'я файлу"}</Text>
        <TextInput
          style={ss.input}
          value={name}
          onChangeText={setName}
          placeholder={isFolder ? 'my-folder' : 'notes.txt'}
          placeholderTextColor={COLORS.textMuted}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
        />

        {!isFolder && (
          <>
            <Text style={ss.label}>Початковий вміст (необов'язково)</Text>
            <TextInput
              style={[ss.input, ss.inputMulti]}
              value={content}
              onChangeText={setContent}
              placeholder="Введіть текст файлу..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </>
        )}

        <View style={ss.sheetBtns}>
          <TouchableOpacity style={ss.btnCancel} onPress={handleClose}>
            <Text style={ss.btnCancelText}>Скасувати</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.btnCreate} onPress={handleCreate}>
            <Text style={ss.btnCreateText}>Створити</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default function HomeScreen({ navigation }) {
  const [currentPath, setCurrentPath] = useState(FileSystem.documentDirectory);
  const [history, setHistory] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storage, setStorage] = useState({ total: 0, free: 0, used: 0 });
  const [modal, setModal] = useState(null); // null | 'folder' | 'file'
  const [fabOpen, setFabOpen] = useState(false);

  const fabAnim = useRef(new Animated.Value(0)).current;

  const toggleFab = () => {
    const toVal = fabOpen ? 0 : 1;
    Animated.spring(fabAnim, { toValue: toVal, useNativeDriver: true, speed: 18, bounciness: 8 }).start();
    setFabOpen(!fabOpen);
  };

  const closeFab = () => {
    if (fabOpen) {
      Animated.spring(fabAnim, { toValue: 0, useNativeDriver: true, speed: 18 }).start();
      setFabOpen(false);
    }
  };

  const loadDir = useCallback(async (path) => {
    setLoading(true);
    try {
      const names = await FileSystem.readDirectoryAsync(path);
      const detailed = await Promise.all(
        names.map(async (name) => {
          try {
            const info = await FileSystem.getInfoAsync(path + name, { size: true });
            return { name, ...info, isDir: info.isDirectory };
          } catch {
            return { name, uri: path + name, isDir: false, size: 0, exists: false };
          }
        })
      );
      detailed.sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setItems(detailed);
    } catch {
      Alert.alert('Помилка', 'Не вдалося прочитати директорію');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStorage = useCallback(async () => {
    try {
      const [free, total] = await Promise.all([
        FileSystem.getFreeDiskStorageAsync(),
        FileSystem.getTotalDiskCapacityAsync(),
      ]);
      setStorage({ total, free, used: total - free });
    } catch {}
  }, []);

  useFocusEffect(useCallback(() => {
    loadDir(currentPath);
    loadStorage();
  }, [currentPath]));

  const goInto = (folderName) => {
    closeFab();
    setHistory(h => [...h, currentPath]);
    setCurrentPath(currentPath + folderName + '/');
  };

  const goBack = () => {
    if (history.length === 0) return;
    closeFab();
    setCurrentPath(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
  };

  const navigateBreadcrumb = (stepsBack) => {
    if (stepsBack <= 0) return;
    const newHistory = history.slice(0, -stepsBack);
    setCurrentPath(history[history.length - stepsBack]);
    setHistory(newHistory);
  };

  const handleCreate = async (name, content) => {
    setModal(null);
    try {
      if (modal === 'folder') {
        await FileSystem.makeDirectoryAsync(currentPath + name, { intermediates: true });
      } else {
        const fileName = name.includes('.') ? name : name + '.txt';
        await FileSystem.writeAsStringAsync(currentPath + fileName, content || '');
      }
      loadDir(currentPath);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося створити: ' + e.message);
    }
  };

  const handleDelete = (item) => {
    const msg = item.isDir
      ? `Видалити папку "${item.name}" разом з усім вмістом?`
      : `Видалити файл "${item.name}"?`;
    Alert.alert('🗑️ Підтвердження', msg, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити', style: 'destructive', onPress: async () => {
          try {
            await FileSystem.deleteAsync(item.uri, { idempotent: true });
            loadDir(currentPath);
          } catch {
            Alert.alert('Помилка', 'Не вдалося видалити');
          }
        },
      },
    ]);
  };

  const handlePress = (item) => {
    if (item.isDir) { goInto(item.name); return; }
    if (isTextFile(item.name)) {
      navigation.navigate('FileViewer', { filePath: item.uri, fileName: item.name });
    } else {
      navigation.navigate('FileInfo', { fileInfo: item });
    }
  };

  const pct = storage.total > 0 ? (storage.used / storage.total) * 100 : 0;
  const barColor = pct > 85 ? COLORS.red : pct > 65 ? COLORS.orange : COLORS.green;

  const folderY = fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -130] });
  const fileY   = fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -75] });
  const fabOpacity = fabAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const fabRotate = fabAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <View style={ss.container}>

      <View style={ss.header}>
        <View style={ss.titleRow}>
          <View>
            <Text style={ss.appName}>FILE<Text style={{ color: COLORS.accent }}>OS</Text></Text>
            <Text style={ss.appSub}>Файловий менеджер</Text>
          </View>
          <View style={ss.statusDot} />
        </View>

        <View style={ss.storageCard}>
          <View style={ss.storageHeader}>
            <Text style={ss.storageTitle}>СХОВИЩЕ ПРИСТРОЮ</Text>
            <Text style={ss.storagePct}>{pct.toFixed(1)}%</Text>
          </View>
          <StorageBar used={storage.used} total={storage.total} />
          <View style={ss.storageStats}>
            <View style={ss.stat}>
              <View style={[ss.statDot, { backgroundColor: COLORS.cyan }]} />
              <View>
                <Text style={ss.statVal}>{formatSize(storage.total)}</Text>
                <Text style={ss.statKey}>Всього</Text>
              </View>
            </View>
            <View style={ss.stat}>
              <View style={[ss.statDot, { backgroundColor: COLORS.green }]} />
              <View>
                <Text style={ss.statVal}>{formatSize(storage.free)}</Text>
                <Text style={ss.statKey}>Вільно</Text>
              </View>
            </View>
            <View style={ss.stat}>
              <View style={[ss.statDot, { backgroundColor: barColor }]} />
              <View>
                <Text style={ss.statVal}>{formatSize(storage.used)}</Text>
                <Text style={ss.statKey}>Зайнято</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={ss.navBar}>
          {history.length > 0 && (
            <TouchableOpacity style={ss.backBtn} onPress={goBack}>
              <Text style={ss.backBtnText}>←  Назад</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Breadcrumb
              history={history}
              currentPath={currentPath}
              onNavigate={navigateBreadcrumb}
            />
          </View>
          <Text style={ss.itemCount}>{items.length} елем.</Text>
        </View>
      </View>

      {loading ? (
        <View style={ss.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={ss.loadingTxt}>Читання директорії...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.uri || item.name}
          renderItem={({ item }) => (
            <FileItem
              item={item}
              onPress={() => handlePress(item)}
              onEdit={() => navigation.navigate('FileEditor', { filePath: item.uri, fileName: item.name })}
              onInfo={() => navigation.navigate('FileInfo', { fileInfo: item })}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={ss.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); loadDir(currentPath).finally(() => setRefreshing(false)); }}
              tintColor={COLORS.accent}
            />
          }
          ListEmptyComponent={
            <View style={ss.empty}>
              <Text style={ss.emptyIcon}>🌌</Text>
              <Text style={ss.emptyTitle}>Директорія порожня</Text>
              <Text style={ss.emptySub}>Натисніть + щоб створити файл або папку</Text>
            </View>
          }
        />
      )}

      {fabOpen && (
        <TouchableOpacity style={ss.fabBackdrop} activeOpacity={1} onPress={closeFab} />
      )}

      <Animated.View style={[ss.fabSub, { transform: [{ translateY: folderY }], opacity: fabOpacity }]}>
        <TouchableOpacity
          style={ss.fabSubBtn}
          onPress={() => { closeFab(); setModal('folder'); }}
        >
          <Text style={ss.fabSubIcon}>📁</Text>
          <Text style={ss.fabSubLabel}>Папка</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[ss.fabSub, { transform: [{ translateY: fileY }], opacity: fabOpacity }]}>
        <TouchableOpacity
          style={ss.fabSubBtn}
          onPress={() => { closeFab(); setModal('file'); }}
        >
          <Text style={ss.fabSubIcon}>📄</Text>
          <Text style={ss.fabSubLabel}>Файл</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={ss.fab} onPress={toggleFab} activeOpacity={0.85}>
        <Animated.Text style={[ss.fabIcon, { transform: [{ rotate: fabRotate }] }]}>+</Animated.Text>
      </TouchableOpacity>

      <CreateModal
        visible={modal !== null}
        type={modal}
        onClose={() => setModal(null)}
        onCreate={handleCreate}
      />
    </View>
  );
}

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  appName: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 4 },
  appSub: { color: COLORS.textMuted, fontSize: 11, letterSpacing: 1, marginTop: 1 },
  statusDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.green,
    shadowColor: COLORS.green,
    shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
  },

  storageCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  storageTitle: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 2, fontWeight: '700' },
  storagePct: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
  barBg: { height: 5, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 12 },
  barFill: { height: 5, borderRadius: 3 },
  storageStats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statVal: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700' },
  statKey: { color: COLORS.textMuted, fontSize: 10 },

  navBar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    backgroundColor: COLORS.accentDim, paddingVertical: 5,
    paddingHorizontal: 12, borderRadius: 20,
  },
  backBtnText: { color: COLORS.accent, fontSize: 12, fontWeight: '700' },
  itemCount: { color: COLORS.textMuted, fontSize: 11 },

  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  crumb: { color: COLORS.textMuted, fontSize: 12 },
  crumbActive: { color: COLORS.textSecondary, fontWeight: '600' },
  crumbSep: { color: COLORS.textMuted, fontSize: 12 },

  listContent: { padding: 14, paddingBottom: 110 },

  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconWrap: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconDir: { backgroundColor: '#1E1A40' },
  iconFile: { backgroundColor: '#111825' },
  iconText: { fontSize: 24 },
  fileInfo: { flex: 1 },
  fileName: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  fileMeta: { color: COLORS.textMuted, fontSize: 11, marginBottom: 4 },
  extPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent + '22',
    borderRadius: 6, paddingVertical: 1, paddingHorizontal: 6,
    borderWidth: 1, borderColor: COLORS.accent + '33',
  },
  extPillText: { color: COLORS.accent, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  actions: { flexDirection: 'row', gap: 5 },
  actionBtn: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
  },
  actionDel: { backgroundColor: '#200F0F' },
  actionIcon: { fontSize: 14 },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingTxt: { color: COLORS.textSecondary, marginTop: 12 },
  empty: { alignItems: 'center', paddingTop: 70 },
  emptyIcon: { fontSize: 54, marginBottom: 14 },
  emptyTitle: { color: COLORS.textSecondary, fontSize: 17, fontWeight: '700', marginBottom: 6 },
  emptySub: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center' },

  fabBackdrop: { ...StyleSheet.absoluteFillObject, zIndex: 5 },
  fab: {
    position: 'absolute', right: 22, bottom: 34,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 10,
  },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 30 },
  fabSub: {
    position: 'absolute', right: 22, bottom: 34,
    flexDirection: 'row', alignItems: 'center',
    zIndex: 9,
  },
  fabSubBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 24, paddingVertical: 10, paddingHorizontal: 16,
    borderWidth: 1, borderColor: COLORS.borderLight,
    gap: 8,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  fabSubIcon: { fontSize: 18 },
  fabSubLabel: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600' },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20 },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    padding: 24, paddingBottom: 44,
    borderTopWidth: 1, borderColor: COLORS.borderLight,
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: 20,
  },
  sheetTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 20 },
  label: { color: COLORS.textSecondary, fontSize: 11, letterSpacing: 1, fontWeight: '600', marginBottom: 7 },
  input: {
    backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.borderLight,
    borderRadius: 12, padding: 13, color: COLORS.textPrimary, fontSize: 15, marginBottom: 16,
  },
  inputMulti: { height: 110, textAlignVertical: 'top' },
  sheetBtns: { flexDirection: 'row', gap: 12, marginTop: 6 },
  btnCancel: {
    flex: 1, padding: 15, borderRadius: 14, borderWidth: 1,
    borderColor: COLORS.border, alignItems: 'center',
  },
  btnCancelText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 14 },
  btnCreate: {
    flex: 1, padding: 15, borderRadius: 14,
    backgroundColor: COLORS.accent, alignItems: 'center',
  },
  btnCreateText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
