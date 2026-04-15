import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        login(email, password);
        router.replace("/"); // 🔥 ПЕРЕХІД
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вхід</Text>

            <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Пароль"
                secureTextEntry
                style={styles.input}
                onChangeText={setPassword}
            />

            <View style={styles.button}>
                <Button title="Увійти" onPress={handleLogin} />
            </View>

            <Link href="/register">
                <Text style={styles.link}>Немає акаунту? Зареєструватися</Text>
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