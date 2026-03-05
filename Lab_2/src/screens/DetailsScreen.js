import React, { useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function DetailsScreen({ route, navigation }) {
  const { newsItem } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: newsItem.category });
  }, [navigation, newsItem]);

  return (
    <ScrollView style={s.container}>
      <Image source={{ uri: newsItem.image }} style={s.image} />
      <View style={s.body}>
        <Text style={s.category}>{newsItem.category}</Text>
        <Text style={s.title}>{newsItem.title}</Text>
        <Text style={s.meta}>Автор: {newsItem.author} · {newsItem.date}</Text>
        <View style={s.divider} />
        <Text style={s.description}>{newsItem.description}</Text>
        <Text style={s.text}>
          {'Детальніший матеріал про цю тему. Редакція NewsApp зібрала коментарі експертів та офіційні заяви представників галузі.\n\nПодія викликала широке обговорення в суспільстві. Очікується, що наслідки відчуватимуться ще тривалий час.'}
        </Text>
        <TouchableOpacity style={s.btn} onPress={() => navigation.goBack()}>
          <Text style={s.btnTxt}>← Назад до новин</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#fff' },
  image:       { width: '100%', height: 230, backgroundColor: '#ddd' },
  body:        { padding: 18 },
  category:    { fontSize: 11, color: '#1976D2', fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  title:       { fontSize: 21, fontWeight: '800', color: '#111', lineHeight: 28, marginBottom: 8 },
  meta:        { fontSize: 13, color: '#999', marginBottom: 14 },
  divider:     { height: 1, backgroundColor: '#eee', marginBottom: 14 },
  description: { fontSize: 15, color: '#333', lineHeight: 23, marginBottom: 14 },
  text:        { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 28 },
  btn:         { backgroundColor: '#1976D2', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  btnTxt:      { color: '#fff', fontWeight: '700', fontSize: 15 },
});
