# FlavorDash 🍳

FlavorDash adalah aplikasi katalog dan pemesanan makanan berbasis **React Native** dan **Expo**. Aplikasi ini dirancang agar responsif pada berbagai ukuran layar Android, memiliki proteksi keamanan rute berbasis JWT, serta dilengkapi dengan fitur kamera untuk bukti penerimaan pesanan dan peta lokasi restoran/tujuan.

---

## 🚀 Fitur Utama

1. **Katalog Makanan (Responsive Flexbox Row Layout)**
   - Desain layout responsif berbentuk baris (row) menggunakan Flexbox sehingga tersusun rapi di berbagai ukuran layar Android.
   - Simulasi pengambilan data makanan dari **Mock API** dengan status memuat (`ActivityIndicator`).
   - Pendeteksian status login secara real-time yang memperbarui tombol tindakan di halaman utama.

2. **Detail Pesanan Terproteksi (JWT & Middleware)**
   - Halaman Detail Pesanan dilindungi oleh **Middleware Navigasi** pada Expo Router (`app/_layout.tsx`).
   - Token JWT divalidasi dan disimpan dengan aman menggunakan `expo-secure-store`.
   - Pengguna yang belum terautentikasi akan otomatis diarahkan kembali ke halaman Login ketika mencoba mengakses halaman terproteksi.

3. **Fitur Kamera (Bukti Penerimaan)**
   - Fitur kamera native terintegrasi di halaman Detail Pesanan menggunakan `expo-camera`.
   - Mengambil foto bukti penerimaan pesanan secara instan, menyimpannya di memori lokal, dan menampilkannya sebagai preview di halaman Detail Pesanan.
   - Dilengkapi tombol "Foto Ulang" jika foto yang diambil ingin diganti.

4. **Fitur Peta (Maps)**
   - Menampilkan peta lokasi restoran pengirim dan lokasi pengantaran pengguna lengkap dengan **dua marker** penanda yang jelas.
   - Menggunakan `react-native-maps` untuk perangkat mobile (Android & iOS) dan otomatis menggunakan **Google Maps/OpenStreetMap interactive iframe** sebagai fallback di platform Web untuk mencegah crash dan mempermudah evaluasi.

---

## 🔑 Akun Demo untuk Pengujian

Gunakan kredensial berikut untuk menguji fitur terproteksi:
- **Username**: `fauzan`
- **Password**: `123456`

---

## 🛠️ Persyaratan Sistem

- **Node.js**: v18 atau yang lebih baru
- **NPM**: v9 atau yang lebih baru
- **Expo CLI**: Terbaru (Expo SDK 54)

---

## ⚙️ Cara Menjalankan Aplikasi

1. **Unduh/Buka Folder Proyek**
   Pastikan Anda berada di direktori utama proyek `FlavorDash`.

2. **Instalasi Dependensi**
   Jalankan perintah berikut di terminal untuk menginstal semua modul yang diperlukan:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**
   Mulai server Expo menggunakan perintah berikut:
   ```bash
   npx expo start
   ```

4. **Memilih Platform Berjalan**:
   - Tekan **`a`** untuk menjalankan pada Emulator Android.
   - Tekan **`i`** untuk menjalankan pada Simulator iOS.
   - Tekan **`w`** untuk menjalankan pada Web Browser.

5. **Linting (Opsional)**
   Untuk memastikan kebersihan kode dan kesesuaian tipe data TypeScript:
   ```bash
   npm run lint
   ```
