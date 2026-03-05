import React from 'react';
import { View, Text, SectionList, Image, StyleSheet } from 'react-native';
import { CONTACTS_DATA } from '../data/newsData';

export default function ContactsScreen() {
  return (
    <SectionList
      sections={CONTACTS_DATA}

      renderItem={({ item }) => (
        <View style={s.row}>
          <Image source={{ uri: item.avatar }} style={s.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.role}>{item.role}</Text>
            <Text style={s.phone}>{item.phone}</Text>
          </View>
        </View>
      )}

      renderSectionHeader={({ section }) => (
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{section.title}</Text>
        </View>
      )}

      keyExtractor={item => item.id}

      ItemSeparatorComponent={() => <View style={s.sep} />}

      stickySectionHeadersEnabled
      contentContainerStyle={{ backgroundColor: '#f4f4f4', paddingBottom: 20 }}
    />
  );
}

const s = StyleSheet.create({
  sectionHeader: { backgroundColor: '#e3eaf4', paddingHorizontal: 16, paddingVertical: 8, borderLeftWidth: 4, borderLeftColor: '#1976D2' },
  sectionTitle:  { fontSize: 13, fontWeight: '700', color: '#333', textTransform: 'uppercase' },
  row:           { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  avatar:        { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ddd', marginRight: 14 },
  name:          { fontSize: 15, fontWeight: '700', color: '#111' },
  role:          { fontSize: 12, color: '#1976D2', marginTop: 1 },
  phone:         { fontSize: 12, color: '#888', marginTop: 2 },
  sep:           { height: 1, backgroundColor: '#f0f0f0', marginLeft: 78 },
});
