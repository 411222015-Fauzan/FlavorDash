import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

// Mengimpor react-native-maps secara kondisional untuk menghindari error pada Web
let MapView: any;
let Marker: any;
if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RNMaps = require("react-native-maps");
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
}

export default function MapsScreen() {
  const router = useRouter();
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [region, setRegion] = useState({
    latitude: -6.221314,
    longitude: 106.828964,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  // Mengambil izin lokasi dan mencari lokasi nyata perangkat
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Izin lokasi ditolak. Menampilkan rute default.");
          setLoading(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };

        setUserCoords(coords);
        
        // Memusatkan peta di antara lokasi restoran dan lokasi user saat ini
        setRegion({
          latitude: (coords.latitude + -6.224314) / 2,
          longitude: (coords.longitude + 106.824964) / 2,
          latitudeDelta: Math.abs(coords.latitude - -6.224314) * 1.5 || 0.015,
          longitudeDelta: Math.abs(coords.longitude - 106.824964) * 1.5 || 0.015,
        });
      } catch (error) {
        console.warn("Gagal mendapatkan lokasi saat ini:", error);
        setErrorMsg("Gagal melacak lokasi saat ini secara akurat.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (Platform.OS === "web") {
    const webQuery = userCoords
      ? `${userCoords.latitude},${userCoords.longitude}`
      : `-6.224314,106.824964`;

    return (
      <View style={styles.container}>
        {/* Header Card untuk Web */}
        <View style={styles.headerCard}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rute Pengantaran (Web)</Text>
        </View>

        {/* Peta Interaktif menggunakan Google Maps Embed Iframe di Web */}
        <View style={styles.mapWrapper}>
          <iframe
            src={`https://maps.google.com/maps?q=${webQuery}&z=15&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: 16 }}
            allowFullScreen
            loading="lazy"
          />
        </View>

        {/* Card Informasi Rute untuk Web */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informasi Rute Pengiriman</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dari (Restoran):</Text>
            <Text style={styles.infoVal}>FlavorDash Central Kitchen</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tujuan (User):</Text>
            <Text style={styles.infoVal}>Rumah Fauzan (Penerima)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Koordinat Anda:</Text>
            <Text style={styles.infoVal}>
              {loading ? (
                "Melacak posisi GPS..."
              ) : userCoords ? (
                `${userCoords.latitude.toFixed(5)}, ${userCoords.longitude.toFixed(5)}`
              ) : (
                errorMsg || "Gagal melacak"
              )}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Tampilan Mobile Native dengan react-native-maps
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Marker 1: Restoran */}
        <Marker
          coordinate={{ latitude: -6.224314, longitude: 106.824964 }}
          title="FlavorDash Central Kitchen"
          description="Restoran Pengirim (Jl. Senopati No. 42)"
          pinColor="#E63946"
        />

        {/* Marker 2: Lokasi Saat Ini (Real Live GPS Location) */}
        {userCoords ? (
          <Marker
            coordinate={userCoords}
            title="Lokasi Anda Saat Ini"
            description="Titik akurat penerima pesanan"
            pinColor="#007AFF"
          />
        ) : (
          /* Marker Fallback ke SCBD jika GPS mati / izin ditolak */
          <Marker
            coordinate={{ latitude: -6.218314, longitude: 106.832964 }}
            title="Lokasi Anda (Fauzan)"
            description="Tujuan Pengantaran (Jl. Sudirman Kav 21)"
            pinColor="#2A9D8F"
          />
        )}
      </MapView>

      {/* Floating Header Card di Mobile */}
      <View style={styles.headerCardMobile}>
        <TouchableOpacity style={styles.backButtonMobile} onPress={() => router.back()}>
          <Text style={styles.backTextMobile}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitleMobile}>Peta Pengantaran</Text>
        {loading && (
          <ActivityIndicator size="small" color="#E63946" style={{ marginLeft: "auto" }} />
        )}
      </View>

      {/* Floating Bottom Card di Mobile */}
      <View style={styles.infoCardMobile}>
        <Text style={styles.infoTitleMobile}>Informasi Pengiriman</Text>
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <View style={styles.iconCircleRed}>
            <Text style={styles.iconText}>🍳</Text>
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailTitle}>FlavorDash Central Kitchen</Text>
            <Text style={styles.detailSubtitle}>Jl. Senopati No. 42, Kebayoran Baru</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.iconCircleGreen}>
            <Text style={styles.iconText}>🏠</Text>
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailTitle}>Lokasi Penerima (Fauzan)</Text>
            <Text style={styles.detailSubtitle}>
              {loading ? (
                "Melacak lokasi nyata..."
              ) : userCoords ? (
                `Akurasi GPS Aktif: ${userCoords.latitude.toFixed(5)}, ${userCoords.longitude.toFixed(5)}`
              ) : (
                errorMsg || "Jl. Jendral Sudirman Kav 21, SCBD"
              )}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Jarak</Text>
            <Text style={styles.statValue}>{userCoords ? "Dihitung..." : "1.8 KM"}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Waktu</Text>
            <Text style={styles.statValue}>~12 Menit</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Kurir</Text>
            <Text style={styles.statValue}>FlavorRider</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Style Utama
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  
  // Style khusus Web
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  backText: {
    fontWeight: "bold",
    color: "#475569",
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  mapWrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  infoCard: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0F172A",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    color: "#64748B",
    fontSize: 14,
  },
  infoVal: {
    fontWeight: "600",
    color: "#1E293B",
    fontSize: 14,
  },

  // Style khusus Mobile
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerCardMobile: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButtonMobile: {
    backgroundColor: "#F1F5F9",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backTextMobile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  headerTitleMobile: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
  },
  infoCardMobile: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  infoTitleMobile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircleRed: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconCircleGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  detailSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A",
  },
});

