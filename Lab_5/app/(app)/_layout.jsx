import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return <Stack />;
}