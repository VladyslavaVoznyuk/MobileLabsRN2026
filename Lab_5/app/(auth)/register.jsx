import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        register(email, password, name);
        router.replace("/"); // 🔥 ВИПРАВЛЕННЯ
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Реєстрація</Text>

            <TextInput placeholder="Ім'я" style={styles.input} onChangeText={setName} />
            <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
            <TextInput
                placeholder="Пароль"
                secureTextEntry
                style={styles.input}
                onChangeText={setPassword}
            />

            <View style={styles.button}>
                <Button title="Зареєструватися" onPress={handleRegister} />
            </View>

            <Link href="/login">
                <Text style={styles.link}>Вже є акаунт? Увійти</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    input: {
        borderWidth: 1,
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
    },
    button: { marginBottom: 15 },
    link: { textAlign: "center", color: "blue" },
});