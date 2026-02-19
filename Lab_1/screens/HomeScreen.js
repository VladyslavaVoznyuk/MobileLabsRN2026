import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const news = [
  {
    id: '1',
    title: 'Заголовок новини',
    date: '12.02.2026',
    text: 'Короткий опис новини.',
    image: require('../assets/news1.png'),
  },
  {
    id: '2',
    title: 'Ще одна новина',
    date: '13.02.2026',
    text: 'Текст новини для прикладу відображення.',
    image: require('../assets/news2.png'),
  },
  {
    id: '3',
    title: 'Оновлення додатку',
    date: '14.02.2026',
    text: 'Опис оновлення або події.',
    image: require('../assets/news3.png'),
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
  },
});
