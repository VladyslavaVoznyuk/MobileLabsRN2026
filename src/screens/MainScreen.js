import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { NEWS_DATA, generateMore } from '../data/newsData';

const Header = () => (
  <View style={s.header}>
    <Text style={s.headerTitle}>Новини</Text>
    <Text style={s.headerSub}>Останні події в Україні</Text>
  </View>
);

const Footer = ({ loading }) =>
  loading
    ? <View style={s.footer}><ActivityIndicator color="#1976D2" /><Text style={s.footerTxt}>Завантаження...</Text></View>
    : <View style={{ height: 20 }} />;

const Separator = () => <View style={s.separator} />;

export default function MainScreen({ navigation }) {
  const [news, setNews]               = useState(NEWS_DATA);
  const [refreshing, setRefreshing]   = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNews(NEWS_DATA);
      setRefreshing(false);
    }, 1500);
  }, []);

  const onEndReached = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setNews(prev => [...prev, ...generateMore(3)]);
      setLoadingMore(false);
    }, 1000);
  }, [loadingMore]);

  return (
    <FlatList
      data={news}
      keyExtractor={item => item.id}

      renderItem={({ item }) => (
        <TouchableOpacity
          style={s.card}
          onPress={() => navigation.navigate('DetailsScreen', { newsItem: item })}
          activeOpacity={0.85}
        >
          <Image source={{ uri: item.image }} style={s.cardImg} />
          <View style={s.cardBody}>
            <Text style={s.cardCat}>{item.category}</Text>
            <Text style={s.cardTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={s.cardDesc}  numberOfLines={2}>{item.description}</Text>
            <Text style={s.cardMeta}>{item.author} · {item.date}</Text>
          </View>
        </TouchableOpacity>
      )}

      ListHeaderComponent={<Header />}
      ListFooterComponent={<Footer loading={loadingMore} />}
      ItemSeparatorComponent={Separator}

      refreshing={refreshing}
      onRefresh={onRefresh}

      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}

      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={10}

      style={{ backgroundColor: '#f4f4f4' }}
      contentContainerStyle={{ paddingBottom: 12 }}
    />
  );
}

const s = StyleSheet.create({
  header:      { padding: 16, paddingBottom: 8, backgroundColor: '#f4f4f4' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111' },
  headerSub:   { fontSize: 13, color: '#888', marginTop: 2 },
  footer:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, gap: 8 },
  footerTxt: { color: '#666', fontSize: 14 },
  separator: { height: 12 },
  card:      { backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardImg:   { width: '100%', height: 180, backgroundColor: '#ddd' },
  cardBody:  { padding: 14 },
  cardCat:   { fontSize: 11, color: '#1976D2', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111', lineHeight: 22, marginBottom: 6 },
  cardDesc:  { fontSize: 13, color: '#666', lineHeight: 19, marginBottom: 8 },
  cardMeta:  { fontSize: 12, color: '#aaa' },
});
