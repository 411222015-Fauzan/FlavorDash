import React, { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Akun default
    if (username === "fauzan" && password === "123456") {
      const dummyToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.dummy";

      await SecureStore.setItemAsync("token", dummyToken);

      router.replace("/detail-pesanan");
    } else {
      Alert.alert(
        "Login Gagal",
        "Username atau password salah"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        }}
        style={styles.banner}
      />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome to FlavorDash</Text>

        <Text style={styles.subtitle}>
          Login untuk melihat detail pesanan makanan Anda.
        </Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.defaultAccount}>
          <Text style={styles.defaultText}>
            Username: fauzan
          </Text>

          <Text style={styles.defaultText}>
            Password: 123456
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    padding: 20,
  },

  banner: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E63946",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },

  input: {
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#E63946",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  defaultAccount: {
    marginTop: 20,
    backgroundColor: "#FFF3CD",
    padding: 14,
    borderRadius: 12,
  },

  defaultText: {
    color: "#856404",
    fontWeight: "600",
  },
});