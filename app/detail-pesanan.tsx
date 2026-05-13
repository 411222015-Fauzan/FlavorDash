import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { checkAuth } from "./middleware";

export default function DetailPesananScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const isLogin = await checkAuth();

      if (!isLogin) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Memeriksa token...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail Pesanan</Text>
      <Text>Nomor Pesanan: FD-001</Text>
      <Text>Menu: Burger Cheese</Text>
      <Text>Jumlah: 2</Text>
      <Text>Total: Rp 50.000</Text>
      <Text>Status: Sedang Diproses</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});