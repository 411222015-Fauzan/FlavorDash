import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const handleLogin = async () => {
    // Contoh token dummy. Pada aplikasi asli, token didapat dari API login.
    const dummyToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.dummy";

    await SecureStore.setItemAsync("token", dummyToken);
    router.replace("/detail-pesanan");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login FlavorDash</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});