import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleReset = async () => {
        if (!email) {
            Alert.alert("Помилка", "Введіть email");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email.trim());
            Alert.alert("Успіх", "Лист надіслано!", [
                { text: "OK", onPress: () => router.replace("/login") }
            ]);
        } catch (error) {
            Alert.alert("Помилка", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Відновлення пароля</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <Button title="Надіслати лист" onPress={handleReset} />
            <Text style={styles.link} onPress={() => router.push("/login")}>
                Назад до входу
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 22, textAlign: "center", marginBottom: 20 },
    input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
    link: { marginTop: 20, textAlign: "center", color: "blue" }
});