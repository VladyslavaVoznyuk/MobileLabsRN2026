import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomDrawer({ state, navigation, ...rest }) {
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index].name;

  const MenuItem = ({ label, icon, screen }) => (
    <TouchableOpacity
      style={[s.item, active === screen && s.itemActive]}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <Text style={s.itemIcon}>{icon}</Text>
      <Text style={[s.itemLabel, active === screen && s.itemLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.profile}>
        <Image source={{ uri: 'https://img.freepik.com/premium-vector/avatar-profile-vector-illustrations-website-social-networks-user-profile-icon_495897-226.jpg' }} style={s.avatar} />
        <Text style={s.name}>Вознюк Владислава</Text>
        <Text style={s.group}>Група ВТ-22-1</Text>
      </View>

      <DrawerContentScrollView state={state} navigation={navigation} {...rest}>
        <MenuItem label="Новини"   icon="📰" screen="NewsStack"      />
        <MenuItem label="Контакти" icon="👥" screen="ContactsScreen" />
      </DrawerContentScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 8 }]}>
        <Text style={s.footerTxt}>NewsApp © 2026</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profile:   { backgroundColor: '#1976D2', alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20 },
  avatar:    { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff', marginBottom: 12 },
  name:      { color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  group:     { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  item:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, marginHorizontal: 8, borderRadius: 10, marginTop: 4 },
  itemActive:      { backgroundColor: '#e3f2fd' },
  itemIcon:        { fontSize: 20, marginRight: 14 },
  itemLabel:       { fontSize: 15, color: '#333', fontWeight: '500' },
  itemLabelActive: { color: '#1976D2', fontWeight: '700' },
  footer:    { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  footerTxt: { fontSize: 11, color: '#bbb' },
});
