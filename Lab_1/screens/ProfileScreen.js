import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Реєстрація</Text>

      <TextInput style={styles.input} placeholder="Електронна пошта" />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry />
      <TextInput style={styles.input} placeholder="Пароль (ще раз)" secureTextEntry />
      <TextInput style={styles.input} placeholder="Прізвище" />
      <TextInput style={styles.input} placeholder="Ім'я" />

      <Button title="Зареєструватися" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
});
