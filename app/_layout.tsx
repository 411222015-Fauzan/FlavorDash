import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { checkAuth } from "../utils/middleware";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkRouteAccess = async () => {
      const isLogin = await checkAuth();
      const currentSegment = segments[0];

      if (currentSegment === "detail-pesanan" || currentSegment === "maps") {
        if (!isLogin) {
          router.replace("/login");
        }
      } else if (currentSegment === "login" && isLogin) {
        router.replace("/detail-pesanan");
      }
    };

    checkRouteAccess();
  }, [segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CartProvider>
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

          <Stack.Screen
            name="maps"
            options={{
              title: "Lokasi Restoran",
            }}
          />
        </Stack>

        <StatusBar style="auto" />
      </CartProvider>
    </ThemeProvider>
  );
}