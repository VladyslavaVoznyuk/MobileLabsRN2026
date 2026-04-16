import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { Link } from "expo-router";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Створення документа користувача у Firestore з ID = UID
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name: "", age: "", city: ""
            });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Реєстрація</Text>
            <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
            <TextInput placeholder="Пароль" style={styles.input} secureTextEntry onChangeText={setPassword} />
            <Button title="Створити акаунт" onPress={handleRegister} />
            <Link href="/login" style={styles.link}>Вже є акаунт? Увійти</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
    input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
    link: { marginTop: 15, textAlign: "center", color: "blue" }
});