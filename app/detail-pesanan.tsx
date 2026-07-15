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
import { useCart } from "../context/CartContext";

export default function DetailPesananScreen() {
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { cartItems, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();

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

  const handleCompleteOrder = () => {
    Alert.alert(
      "Pesanan Selesai",
      "Terima kasih! Bukti penerimaan telah diunggah dan pesanan diselesaikan.",
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.replace("/");
          },
        },
      ]
    );
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

  // Tampilan ketika keranjang kosong
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Keranjang Belanja Kosong</Text>
        <Text style={styles.emptySubtext}>Silakan kembali ke katalog untuk menambahkan menu.</Text>
        <TouchableOpacity
          style={styles.emptyBackButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.emptyBackButtonText}>Pilih Menu Sekarang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Detail Pesanan</Text>

      {/* Info Status Pesanan */}
      <View style={styles.statusCard}>
        <View style={styles.row}>
          <Text style={styles.statusLabel}>Nomor Pesanan</Text>
          <Text style={styles.statusValue}>FD-001</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>Sedang Diproses</Text>
          </View>
        </View>
      </View>

      {/* Rincian Menu Pesanan (Data Dinamis Basis Data Keranjang) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Rincian Menu ({getCartCount()} Item)</Text>
        <View style={styles.divider} />

        {cartItems.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {item.quantity}x {item.price}
              </Text>
              <Text style={styles.itemSubtotal}>
                Subtotal: Rp {(item.priceNum * item.quantity).toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => updateQuantity(item.id, -1)}
              >
                <Text style={styles.controlButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => updateQuantity(item.id, 1)}
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Pembayaran</Text>
          <Text style={styles.summaryValue}>Rp {getCartTotal().toLocaleString("id-ID")}</Text>
        </View>
      </View>

      {/* Bagian Bukti Penerimaan (Camera Feature) */}
      <View style={styles.proofSection}>
        <Text style={styles.proofTitle}>Bukti Penerimaan</Text>
        
        {photoUri ? (
          <View>
            <Image source={{ uri: photoUri }} style={styles.proofImage} />
            <View style={styles.buttonRowInline}>
              <TouchableOpacity style={[styles.photoButtonHalf, styles.btnSecondary]} onPress={openCamera}>
                <Text style={styles.photoButtonText}>Foto Ulang</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.photoButtonHalf, styles.btnSuccess]} onPress={handleCompleteOrder}>
                <Text style={styles.photoButtonText}>Konfirmasi</Text>
              </TouchableOpacity>
            </View>
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
  statusCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: "#555",
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  statusBox: {
    backgroundColor: "#FFE5B4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: "#C76B00",
    fontWeight: "bold",
    fontSize: 12,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    paddingLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  itemPrice: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  itemSubtotal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E63946",
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 4,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E63946",
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
  buttonRowInline: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photoButtonHalf: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  btnSecondary: {
    backgroundColor: "#6C757D",
  },
  btnSuccess: {
    backgroundColor: "#2A9D8F",
  },
  photoButtonText: {
    color: "white",
    fontSize: 14,
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
  
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  emptyBackButton: {
    backgroundColor: "#E63946",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
  },
  emptyBackButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});