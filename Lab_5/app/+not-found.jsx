import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function NotFound() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Екран не знайдено</Text>

            <Pressable
                style={styles.button}
                onPress={() => router.replace("/")}
            >
                <Text style={styles.buttonText}>На головну</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});