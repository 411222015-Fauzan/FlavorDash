import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button, FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

const mockApiFoods = [
  {
    id: "1",
    name: "Burger Cheese",
    price: "Rp 25.000",
    description: "Burger dengan daging sapi, keju, dan sayuran segar.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: "2",
    name: "Pizza Pepperoni",
    price: "Rp 45.000",
    description: "Pizza lezat dengan topping pepperoni dan saus tomat.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
  },
  {
    id: "3",
    name: "Sushi Roll",
    price: "Rp 35.000",
    description: "Sushi roll dengan nasi, nori, ikan, dan sayuran.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
  },
];

export default function App() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    // Simulasi ambil data dari API
    setFoods(mockApiFoods);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.foodImage} />

      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDescription}>{item.description}</Text>
        <Text style={styles.foodPrice}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>FlavorDash</Text>
      <Text style={styles.subtitle}>Katalog Makanan</Text>

      <View style={styles.loginButton}>
  <Button
    title="Login & Lihat Detail Pesanan"
    onPress={() => router.push("/login")}
  />
</View>

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    color: "#E63946",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    elevation: 3,
  },
  foodImage: {
    width: "35%",
    aspectRatio: 1,
    borderRadius: 10,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  foodDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 6,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E63946",
  },
  loginButton: {
  marginBottom: 16,
}
});