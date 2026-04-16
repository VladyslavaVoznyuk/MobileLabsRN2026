import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { View, ActivityIndicator } from "react-native";

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
    const [user, setUser] = useState(undefined);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        return onAuthStateChanged(auth, setUser);
    }, []);

    useEffect(() => {
        if (user === undefined) return;
        const inAuthGroup = segments[0] === "(auth)";

        if (!user && !inAuthGroup) {
            router.replace("/(auth)/login");
        } else if (user && inAuthGroup) {
            router.replace("/(app)");
        }
    }, [user, segments]);

    if (user === undefined) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator size="large" /></View>
        );
    }

    return (
        <AuthContext.Provider value={{ user }}>
            <Slot />
        </AuthContext.Provider>
    );
}