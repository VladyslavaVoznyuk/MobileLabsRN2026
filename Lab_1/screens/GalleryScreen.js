import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

const photos = Array.from({ length: 10 }, (_, i) => i.toString());

export default function GalleryScreen() {
  return (
    <FlatList
      data={photos}
      numColumns={2}
      keyExtractor={(item) => item}
      renderItem={() => <View style={styles.photo} />}
    />
  );
}

const styles = StyleSheet.create({
  photo: {
    flex: 1,
    height: 120,
    margin: 8,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
});
