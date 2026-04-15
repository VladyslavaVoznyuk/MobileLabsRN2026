import {
    View,
    Text,
    FlatList,
    Image,
    Button,
    Pressable,
    StyleSheet,
} from "react-native";
import { products } from "../../data/products";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
    const { logout } = useAuth();

    return (
        <View style={styles.container}>
            <Button title="Вийти" onPress={logout} />

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link href={`/details/${item.id}`} asChild>
                        <Pressable style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.price}>{item.price} грн</Text>
                        </Pressable>
                    </Link>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    card: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    image: { width: "100%", height: 180, borderRadius: 10 },
    title: { fontSize: 18, marginTop: 10 },
    price: { fontSize: 16, color: "green" },
});