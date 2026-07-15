import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { checkAuth } from "../utils/middleware";

const mockApiFoods = [
  {
    id: "1",
    name: "Burger Cheese",
    price: "Rp 25.000",
    description: "Burger premium dengan daging sapi dan keju mozzarella.",
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    category: "Makanan",
  },
  {
    id: "2",
    name: "Pizza Pepperoni",
    price: "Rp 45.000",
    description: "Pizza lezat dengan topping pepperoni sapi berkualitas.",
    image:
      "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
    category: "Makanan",
  },
  {
    id: "3",
    name: "Sushi Roll",
    price: "Rp 35.000",
    description: "Sushi roll segar khas Jepang dengan isian salmon.",
    image:
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
    category: "Makanan",
  },
  {
    id: "4",
    name: "Spaghetti",
    price: "Rp 30.000",
    description: "Spaghetti carbonara dengan saus krim lembut dan keju parut.",
    image:
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    category: "Makanan",
  },
  {
    id: "5",
    name: "Beef Bowl",
    price: "Rp 40.000",
    description: "Irisan daging sapi gurih disajikan hangat di atas nasi pulen.",
    image:
      "https://images.pexels.com/photos/2006151/pexels-photo-2006151.jpeg",
    category: "Makanan",
  },
  {
    id: "6",
    name: "Fried Chicken",
    price: "Rp 22.000",
    description: "Ayam goreng renyah bumbu rempah tradisional.",
    image:
      "https://images.pexels.com/photos/2232433/pexels-photo-2232433.jpeg",
    category: "Makanan",
  },
  {
    id: "7",
    name: "Kentang Goreng",
    price: "Rp 15.000",
    description: "Kentang goreng renyah dengan taburan garam dan saus cocolan.",
    image:
      "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg",
    category: "Makanan",
  },
  {
    id: "8",
    name: "Kopi Susu",
    price: "Rp 18.000",
    description: "Kopi espresso pilihan dicampur susu segar dan gula aren.",
    image:
      "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
    category: "Minuman",
  },
  {
    id: "9",
    name: "Coca Cola",
    price: "Rp 10.000",
    description: "Minuman berkarbonasi dingin yang menyegarkan dahaga.",
    image:
      "https://images.pexels.com/photos/3819969/pexels-photo-3819969.jpeg",
    category: "Minuman",
  },
  {
    id: "10",
    name: "Air Mineral",
    price: "Rp 6.000",
    description: "Air mineral murni dingin dan segar dalam botol kemasan.",
    image:
      "https://images.pexels.com/photos/35020123/pexels-photo-35020123.jpeg",
    category: "Minuman",
  },
  {
    id: "11",
    name: "Teh Manis",
    price: "Rp 8.000",
    description: "Es teh manis segar dari seduhan daun teh premium.",
    image:
      "https://images.pexels.com/photos/33044292/pexels-photo-33044292.jpeg",
    category: "Minuman",
  },
];

export default function HomeScreen() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const isFocused = useIsFocused();

  const { cartItems, addToCart, getCartCount, getCartTotal } = useCart();

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

  const getQuantityInCart = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const renderItem = ({ item }: any) => {
    const qty = getQuantityInCart(item.id);
    
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.image }}
          style={styles.foodImage}
        />

        <View style={styles.foodInfo}>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.foodName}>
                {qty > 0 ? `${qty}x ` : ""}{item.name}
              </Text>
              <View style={[styles.badge, item.category === "Minuman" ? styles.badgeBlue : styles.badgeRed]}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            </View>
            <Text style={styles.foodDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.foodPrice}>{item.price}</Text>

            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => {
                addToCart(item);
              }}
            >
              <Text style={styles.orderButtonText}>Pesan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Filter menu makanan/minuman berdasarkan kategori terpilih
  const filteredFoods = selectedCategory === "Semua"
    ? foods
    : foods.filter((item: any) => item.category === selectedCategory);

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

      {/* Tabs Filter Kategori */}
      <View style={styles.categoriesContainer}>
        {["Semua", "Makanan", "Minuman"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              selectedCategory === cat && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === cat && styles.categoryTabTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E63946" />
          <Text style={styles.loadingText}>Memuat katalog makanan...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFoods}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: getCartCount() > 0 ? 100 : 20 }}
        />
      )}

      {/* Floating Cart Bar (Basis Data Keranjang Belanja) */}
      {getCartCount() > 0 && (
        <View style={styles.floatingCart}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartCountText}>🛒 {getCartCount()} Item Terpilih</Text>
            <Text style={styles.cartTotalText}>
              Rp {getCartTotal().toLocaleString("id-ID")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => {
              if (isLoggedIn) {
                router.push("/detail-pesanan");
              } else {
                router.push("/login");
              }
            }}
          >
            <Text style={styles.cartButtonText}>Lanjut Pesan ➔</Text>
          </TouchableOpacity>
        </View>
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
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryTab: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 1,
  },
  categoryTabActive: {
    backgroundColor: "#E63946",
    borderColor: "#E63946",
  },
  categoryTabText: {
    color: "#4A5568",
    fontSize: 14,
    fontWeight: "bold",
  },
  categoryTabTextActive: {
    color: "white",
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
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    paddingRight: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    marginRight: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRed: {
    backgroundColor: "#FFEBEB",
  },
  badgeBlue: {
    backgroundColor: "#EBF4FF",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
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
  floatingCart: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cartInfo: {
    flexDirection: "column",
  },
  cartCountText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  cartTotalText: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },
  cartButton: {
    backgroundColor: "#E63946",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cartButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});