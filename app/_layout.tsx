import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>

        <Stack.Screen
          name="index"
          options={{
            title: "FlavorDash",
          }}
        />

        <Stack.Screen
          name="login"
          options={{
            title: "Login",
          }}
        />

        <Stack.Screen
          name="detail-pesanan"
          options={{
            title: "Detail Pesanan",
          }}
        />

      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}