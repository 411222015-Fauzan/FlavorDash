# FlavorDash 🍳

FlavorDash adalah aplikasi pemesanan makanan mobile yang dibangun dengan **React Native** dan **Expo**. Aplikasi menampilkan katalog menu, keranjang belanja, otentikasi sederhana, bukti penerimaan lewat kamera, dan peta lokasi restoran.

## 📌 Ringkasan
FlavorDash memperlihatkan alur pemesanan dari katalog makanan hingga detail pesanan yang dilindungi otentikasi, lalu menambahkan fitur bukti penerimaan dan peta pengantaran.

## 🧰 Stack Teknis
- Bahasa pemrograman: **TypeScript**
- Framework: **React Native** + **Expo**
- Routing: **expo-router**
- Storage lokal: **expo-secure-store**
- Kamera: **expo-camera**
- Peta: **react-native-maps**
- UI: **react-native-safe-area-context**, **@expo/vector-icons**, **react-native-gesture-handler**

## 🤖 AI Recommendation
- Tidak ada integrasi API AI atau OpenAI dalam kode saat ini.

## 🗄️ Database / API
- Tidak menggunakan backend database eksternal.
- Data menu diambil dari **mock data lokal** di halaman utama.
- Token JWT dan keranjang disimpan secara lokal menggunakan **expo-secure-store**.

## 🔄 Flow Aplikasi
1. Halaman utama menampilkan daftar makanan dan minuman dari mock API lokal.
2. Pengguna dapat menambahkan item ke keranjang menggunakan konteks global (`CartContext`).
3. Halaman `detail-pesanan` hanya dapat diakses setelah login; middleware di `app/_layout.tsx` mengarahkan ulang pengguna yang belum otentikasi.
4. Di halaman detail pesanan, pengguna dapat melihat ringkasan item, mengubah jumlah, dan mengambil foto bukti penerimaan menggunakan kamera.
5. Tombol peta membuka halaman `maps` dengan lokasi restoran dan lokasi pengguna, menggunakan `react-native-maps` pada mobile dan iframe Google Maps pada web.

## 🧭 Cara Menjalankan
1. Buka folder proyek di terminal.
2. Jalankan `npm install`.
3. Jalankan `npx expo start`.
4. Pilih target platform: Android, iOS, atau Web.

## ⚙️ Catatan Teknis
- Autentikasi sederhana menggunakan token JWT dummy disimpan di SecureStore.
- `checkAuth()` di `utils/middleware.ts` memvalidasi token sebelum mengizinkan akses ke halaman terproteksi.
- Keranjang belanja persistensi lokal diimplementasikan di `context/CartContext.tsx`.
