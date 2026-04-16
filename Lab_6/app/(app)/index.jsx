import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut } from "firebase/auth";

export default function Profile() {
    const user = auth.currentUser;
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({ name: "", age: "", city: "" });
    const [passwordForDelete, setPasswordForDelete] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) setProfile(docSnap.data());
                }
            } catch (e) { console.log(e); }
            finally { setLoading(false); }
        };
        fetchUserData();
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            await setDoc(doc(db, "users", user.uid), profile, { merge: true });
            Alert.alert("Успіх", "Дані оновлено!");
        } catch (e) { Alert.alert("Помилка", e.message); }
    };

    const handleDeleteAccount = async () => {
        if (!passwordForDelete) {
            Alert.alert("Увага", "Введіть пароль у поле нижче, щоб підтвердити видалення.");
            return;
        }

        Alert.alert(
            "Видалення",
            "Ви впевнені? Це видалить усі ваші дані назавжди.",
            [
                { text: "Скасувати", style: "cancel" },
                {
                    text: "ТАК, ВИДАЛИТИ",
                    onPress: async () => {
                        try {
                            const credential = EmailAuthProvider.credential(user.email, passwordForDelete);
                            await reauthenticateWithCredential(user, credential);
                            await deleteDoc(doc(db, "users", user.uid));
                            await deleteUser(user);
                        } catch (error) {
                            if (error.code === 'auth/wrong-password') {
                                Alert.alert("Помилка", "Невірний пароль.");
                            } else {
                                Alert.alert("Помилка", "Сталася помилка. Спробуйте вийти і зайти знову.");
                            }
                        }
                    }
                }
            ]
        );
    };

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#000" /></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.welcomeText}>Вітаємо, {user?.email}</Text>

            <TextInput
                style={styles.input}
                value={profile.name}
                placeholder="Ім'я"
                onChangeText={(t) => setProfile({...profile, name: t})}
            />
            <TextInput
                style={styles.input}
                value={profile.age}
                placeholder="Вік"
                keyboardType="numeric"
                onChangeText={(t) => setProfile({...profile, age: t})}
            />
            <TextInput
                style={styles.input}
                value={profile.city}
                placeholder="Місто"
                onChangeText={(t) => setProfile({...profile, city: t})}
            />

            <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={handleSaveProfile}>
                <Text style={styles.buttonText}>ОНОВИТИ ПРОФІЛЬ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.orangeButton]} onPress={() => signOut(auth)}>
                <Text style={styles.buttonText}>ВИЙТИ</Text>
            </TouchableOpacity>

            <View style={styles.deleteSection}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Введіть пароль для видалення"
                    secureTextEntry
                    value={passwordForDelete}
                    onChangeText={setPasswordForDelete}
                />
                <TouchableOpacity style={[styles.button, styles.redButton]} onPress={handleDeleteAccount}>
                    <Text style={styles.buttonText}>ВИДАЛИТИ АКАУНТ</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 25, paddingTop: 50, backgroundColor: "#fff", flexGrow: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    welcomeText: { fontSize: 18, fontWeight: "bold", marginBottom: 30 },
    input: { borderBottomWidth: 1.5, borderColor: "#000", marginBottom: 35, fontSize: 16, paddingBottom: 5 },
    button: { height: 50, borderRadius: 5, justifyContent: "center", alignItems: "center", marginBottom: 15, elevation: 2 },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    blueButton: { backgroundColor: "#2196F3" },
    orangeButton: { backgroundColor: "#FFA000" },
    redButton: { backgroundColor: "#FF0000" },
    deleteSection: { marginTop: 40 },
    passwordInput: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, marginBottom: 10, fontSize: 14 }
});