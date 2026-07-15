import { router } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { checkAuth } from "../utils/middleware";

export default function DetailPesananScreen() {
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();

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

  const openCamera = async () => {
    if (!permission) {
      // Permissions are loading
      return;
    }
    
    if (!permission.granted) {
      const res = await requestPermission();
      if (res.granted) {
        setShowCamera(true);
      } else {
        Alert.alert(
          "Izin Kamera Ditolak",
          "Aplikasi membutuhkan izin kamera untuk mengambil foto bukti penerimaan."
        );
      }
    } else {
      setShowCamera(true);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          skipProcessing: false,
        });
        setPhotoUri(photo.uri);
        setShowCamera(false);
      } catch (error) {
        Alert.alert("Error", "Gagal mengambil foto");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E63946" />
        <Text style={{ marginTop: 10 }}>Memeriksa token...</Text>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={StyleSheet.absoluteFillObject} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeCameraButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeCameraText}>✕ Batal</Text>
            </TouchableOpacity>

            <View style={styles.shutterContainer}>
              <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
                <View style={styles.shutterInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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

      {/* Bagian Bukti Penerimaan (Camera Feature) */}
      <View style={styles.proofSection}>
        <Text style={styles.proofTitle}>Bukti Penerimaan</Text>
        
        {photoUri ? (
          <View>
            <Image source={{ uri: photoUri }} style={styles.proofImage} />
            <TouchableOpacity style={styles.secondaryActionButton} onPress={openCamera}>
              <Text style={styles.secondaryActionButtonText}>Foto Ulang</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.proofPlaceholder}>
              <Text style={styles.placeholderText}>Belum ada foto bukti penerimaan</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={openCamera}>
              <Text style={styles.actionButtonText}>Ambil Foto Bukti</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bagian Maps Navigation */}
      <TouchableOpacity
        style={styles.mapsButton}
        onPress={() => router.push("/maps")}
      >
        <Text style={styles.mapsButtonText}>📍 Lihat Peta Lokasi Restoran</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.backButtonText}>Kembali ke Katalog</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E63946",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  foodImage: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: "#555",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
  },
  price: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#E63946",
  },
  statusBox: {
    backgroundColor: "#FFE5B4",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  statusText: {
    color: "#C76B00",
    fontWeight: "bold",
    fontSize: 15,
  },
  proofSection: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  proofTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  proofPlaceholder: {
    height: 140,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    marginBottom: 12,
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
  },
  proofImage: {
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    resizeMode: "cover",
  },
  actionButton: {
    backgroundColor: "#E63946",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  secondaryActionButton: {
    backgroundColor: "#6C757D",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryActionButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  closeCameraButton: {
    alignSelf: "flex-start",
    marginTop: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeCameraText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  shutterContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  shutterButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  mapsButton: {
    marginTop: 20,
    backgroundColor: "#2A9D8F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#222",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});