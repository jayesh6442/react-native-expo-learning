import { AlertProvider } from "@/context/AlertContext";
import { SavedProvider } from "@/context/SavedContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AlertProvider>
      <SavedProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        </Stack>
      </SavedProvider>
    </AlertProvider>
  );
}
