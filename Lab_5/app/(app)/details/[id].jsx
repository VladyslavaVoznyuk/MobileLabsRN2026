import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { products } from "../../../data/products";

export default function Details() {
    const { id } = useLocalSearchParams();

    const product = products.find((p) => p.id === id);

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Товар не знайдено</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />

            <View style={styles.content}>
                <Text style={styles.title}>{product.name}</Text>

                <Text style={styles.price}>{product.price} грн</Text>

                <Text style={styles.descriptionTitle}>Опис:</Text>
                <Text style={styles.description}>{product.description}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: {
        width: "100%",
        height: 250,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: "green",
        marginBottom: 15,
    },
    descriptionTitle: {
        fontSize: 18,
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: "#555",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});