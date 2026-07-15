import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { checkAuth } from "../utils/middleware";

const mockApiFoods = [
  {
    id: "1",
    name: "Burger Cheese",
    price: "Rp 25.000",
    description: "Burger premium dengan daging sapi dan keju mozzarella.",
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
  },
  {
    id: "2",
    name: "Pizza Pepperoni",
    price: "Rp 45.000",
    description: "Pizza lezat dengan topping pepperoni sapi berkualitas.",
    image:
      "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
  },
  {
    id: "3",
    name: "Sushi Roll",
    price: "Rp 35.000",
    description: "Sushi roll segar khas Jepang dengan isian salmon.",
    image:
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
  },
];

export default function HomeScreen() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isFocused = useIsFocused();

  // Memeriksa status autentikasi JWT setiap kali halaman ini aktif
  useEffect(() => {
    const checkUserAuth = async () => {
      const auth = await checkAuth();
      setIsLoggedIn(auth);
    };

    if (isFocused) {
      checkUserAuth();
    }
  }, [isFocused]);

  // Simulasi fetch data makanan dari Mock API / Custom API
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulasi delay jaringan 800ms
      setFoods(mockApiFoods);
      setLoading(false);
    };

    fetchFoods();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    setIsLoggedIn(false);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.foodImage}
      />

      <View style={styles.foodInfo}>
        <View>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.foodPrice}>{item.price}</Text>

          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => {
              if (isLoggedIn) {
                router.push("/detail-pesanan");
              } else {
                router.push("/login");
              }
            }}
          >
            <Text style={styles.orderButtonText}>Pesan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.title}>FlavorDash</Text>
        <Text style={styles.subtitle}>
          Temukan makanan favoritmu dengan cepat dan mudah
        </Text>
      </View>

      {isLoggedIn ? (
        <View style={styles.authContainer}>
          <Text style={styles.welcomeText}>Halo, fauzan! 👋 Sudah terautentikasi</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => router.push("/detail-pesanan")}
            >
              <Text style={styles.detailButtonText}>Lihat Pesanan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>
            Login untuk Melihat Pesanan
          </Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E63946" />
          <Text style={styles.loadingText}>Memuat katalog makanan...</Text>
        </View>
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 16,
  },
  heroSection: {
    backgroundColor: "#E63946",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "#FFEAEA",
    marginTop: 6,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: "#E63946",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  authContainer: {
    backgroundColor: "#E9ECEF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  detailButton: {
    flex: 1,
    backgroundColor: "#E63946",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  detailButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#6C757D",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    alignItems: "center",
  },
  foodImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  foodInfo: {
    flex: 1,
    paddingLeft: 12,
    height: 90,
    justifyContent: "space-between",
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  foodDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E63946",
  },
  orderButton: {
    backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orderButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
});