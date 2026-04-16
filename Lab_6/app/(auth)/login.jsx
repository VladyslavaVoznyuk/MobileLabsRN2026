import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Link } from "expo-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вхід</Text>
            <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
            <TextInput placeholder="Пароль" style={styles.input} secureTextEntry onChangeText={setPassword} />
            <Button title="Увійти" onPress={() => signInWithEmailAndPassword(auth, email, password).catch(e => alert(e.message))} />
            <Link href="/register" style={styles.link}>Зареєструватися</Link>
            <Link href="/forgot-password" style={styles.link}>Забули пароль?</Link>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
    input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
    link: { marginTop: 15, textAlign: "center", color: "blue" }
});