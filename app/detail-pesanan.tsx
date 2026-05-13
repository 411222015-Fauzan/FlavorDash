import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { checkAuth } from "../utils/middleware";

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E63946" />
        <Text style={{ marginTop: 10 }}>Memeriksa token...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detail Pesanan</Text>

      <View style={styles.card}>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
          }}
          style={styles.foodImage}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.foodName}>Burger Cheese</Text>

          <Text style={styles.description}>
            Burger premium dengan daging sapi, keju mozzarella, dan sayuran segar.
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Nomor Pesanan</Text>
            <Text style={styles.value}>FD-001</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Jumlah</Text>
            <Text style={styles.value}>2 Item</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.price}>Rp 50.000</Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusText}>Sedang Diproses</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backButtonText}>Kembali ke Katalog</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E63946",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
  },

  foodImage: {
    width: "100%",
    height: 240,
  },

  infoContainer: {
    padding: 20,
  },

  foodName: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    fontSize: 16,
    color: "#555",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E63946",
  },

  statusBox: {
    backgroundColor: "#FFE5B4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  statusText: {
    color: "#C76B00",
    fontWeight: "bold",
    fontSize: 16,
  },

  backButton: {
    marginTop: 25,
    backgroundColor: "#E63946",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});