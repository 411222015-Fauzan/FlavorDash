import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const mockApiFoods = [
  {
    id: "1",
    name: "Burger Cheese",
    price: "Rp 25.000",
    description: "Burger premium dengan daging sapi dan keju.",
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
  },
  {
    id: "2",
    name: "Pizza Pepperoni",
    price: "Rp 45.000",
    description: "Pizza lezat dengan topping pepperoni.",
    image:
      "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
  },
  {
    id: "3",
    name: "Sushi Roll",
    price: "Rp 35.000",
    description: "Sushi roll segar khas Jepang.",
    image:
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
  },
];

export default function HomeScreen() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    setFoods(mockApiFoods);
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.foodImage}
      />

      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>

        <Text style={styles.foodDescription}>
          {item.description}
        </Text>

        <Text style={styles.foodPrice}>{item.price}</Text>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.orderButtonText}>
            Pesan Sekarang
          </Text>
        </TouchableOpacity>
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

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.loginButtonText}>
          Login untuk Melihat Pesanan
        </Text>
      </TouchableOpacity>

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
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

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5,
  },

  foodImage: {
    width: "100%",
    height: 220,
  },

  foodInfo: {
    padding: 16,
  },

  foodName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },

  foodDescription: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginTop: 8,
  },

  foodPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E63946",
    marginTop: 14,
  },

  orderButton: {
    backgroundColor: "#222",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },

  orderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});