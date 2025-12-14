# 🏝️ Warisan Nusantara: Penerjemah Bahasa Madura

> **Eksplorasi Budaya Madura melalui Teknologi Neural Machine Translation**

![Project Banner](static/images/madura_landscape_hero.jpg)

## 📖 Tentang Proyek Ini

**Warisan Nusantara** adalah aplikasi berbasis web yang dirancang untuk melestarikan dan mempromosikan bahasa serta budaya Madura. Inti dari aplikasi ini menampilkan model **Neural Machine Translation (NMT)** yang mampu menerjemahkan secara akurat dua arah antara **Bahasa Indonesia** dan **Bahasa Madura**.

Proyek ini lebih dari sekadar alat penerjemah biasa, melainkan berfungsi sebagai etalase budaya digital. Aplikasi ini mengintegrasikan teknologi web modern dengan estetika tradisional, menampilkan:
- **Visual 3D Interaktif**: Pemandangan 3D berbasis partikel yang ditenagai oleh Three.js.
- **Identitas Budaya**: Filosofi desain yang berakar pada warisan Madura (Tema Batik dan Maritim).
- **Aksesibilitas**: Fitur Speech-to-Text canggih untuk interaksi yang lebih mudah.

**Konteks Akademik**
Proyek ini dikembangkan sebagai Tugas Akhir (Final Project) untuk mata kuliah **Pemrosesan Bahasa Alami (NLP)** oleh **Kelompok I - Teknologi Sains Data, Universitas Airlangga**.

## ✨ Fitur Utama

### 🤖 Penerjemahan Cerdas & Suara
* **🔄 NMT Dua Arah**: Ditenagai oleh **HuggingFace Transformers** dan **PyTorch**, model ini menyediakan terjemahan akurat dari Bahasa Indonesia ke Madura dan sebaliknya.
* **🎙️ Speech-to-Text (STT) Canggih**: Terintegrasi dengan **OpenAI Whisper (Small Model)**. Peningkatan ini memungkinkan pengenalan dialek Indonesia dan Madura yang jauh lebih baik dibandingkan model standar, lengkap dengan umpan balik kesalahan waktu nyata (real-time error feedback) dan pemrosesan **FFmpeg** yang andal.

### 🎨 UI/UX Budaya yang Imersif
* **Estetika Modern**: Palet warna profesional yang menggabungkan dasar **Maroon** dengan aksen **Emas (Batik)** dan **Teal (Maritim)**, menggantikan gaya umum dengan nuansa asli Madura yang hidup.
* **Integrasi Batik**: Latar belakang yang dihiasi dengan motif batik geometris halus khas Madura.
* **Pengalaman Visual**:
    * **Sistem Partikel 3D**: Animasi geometris interaktif menggunakan `Three.js`.
    * **Mode Gelap 2.0**: Dioptimalkan untuk keterbacaan dengan latar belakang yang lebih terang (`#1a1212`) dan opasitas kartu yang disempurnakan.
    * **Glassmorphism**: Elemen UI kaca buram modern dengan batas (border) yang bersih dan profesional.

## 🛠️ Teknologi yang Digunakan

### Backend & AI
* **Python**: Bahasa pemrograman inti.
* **Flask**: Framework web untuk menjalankan aplikasi dan API.
* **PyTorch**: Framework deep learning yang digunakan untuk model NMT.
* **Transformers**: Pustaka untuk arsitektur model terjemahan.
* **OpenAI Whisper**: Model Speech-to-Text mutakhir.
* **FFmpeg**: Alat penting untuk pemrosesan dan konversi audio.

### Frontend
* **HTML5 & CSS3**: Penataan gaya kustom dengan fokus pada desain responsif dan budaya.
* **JavaScript (ES6+)**: Interaksi dinamis dan penanganan API.
* **Three.js**: Rendering pemandangan budaya 3D dan animasi partikel.
* **FontAwesome**: Untuk ikon antarmuka pengguna (UI).

## 🚀 Memulai (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan proyek secara lokal.

### Prasyarat
* Python 3.8+
* pip (manajer paket Python)
* **FFmpeg**: Harus terinstal di sistem Anda dan ditambahkan ke PATH (diperlukan untuk Whisper STT).

### Instalasi

1.  **Clone repositori**
    ```bash
    git clone [https://github.com/addaan1/indo-madura-nlp](https://github.com/addaan1/indo-madura-nlp)
    cd indo-madura-nlp
    ```

2.  **Buat Virtual Environment (Disarankan)**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Instal Dependensi**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Jalankan Aplikasi**
    ```bash
    python app.py
    ```

5.  **Akses Web App**
    Buka browser dan kunjungi: `http://127.0.0.1:5000`

## 📂 Struktur Proyek

```text
NLP-Final-Project/
├── app.py              # Aplikasi utama Flask
├── utils.py            # Fungsi pembantu (logika terjemahan, pemrosesan audio Whisper)
├── requirements.txt    # Dependensi Python
├── static/             # Aset statis
│   ├── css/            # Stylesheets (style.css, opening.css)
│   ├── js/             # File JavaScript (3d_scene.js, animations.js)
│   └── images/         # Aset gambar
└── templates/          # Template HTML
    ├── base.html       # Layout dasar
    └── index.html      # Halaman utama (landing page)
```

## 👥 Penulis

**Kelompok I — Teknologi Sains Data, Universitas Airlangga**

* **Ghaly Anargya Azzam Rifqi Nahindra** - *Pengembangan Model*
* **Sahrul Adicandra Effendy** - *Pengembangan Backend & Frontend*
* **Adinda Syarifatul Muna** - *Manajemen Tim & Pengembangan Model*
* **Fatma Hidayatul Khusna** - *Koordinasi Proyek*
* **Pradipta Deska Pryanda** - *Ide & Inspirasi*

## 📝 Catatan Pengumpulan Final Project

**Identitas Kelompok**
* **Nomor Kelompok**: Kelompok I
* **Asal**: Teknologi Sains Data, Universitas Airlangga
* **Judul Project**: Warisan Nusantara: Madura Language Translator

**Ringkasan Library Utama**
1. **Flask**: Web Server.
2. **Transformers**: Arsitektur Model.
3. **PyTorch**: Framework Deep Learning.
4. **OpenAI Whisper**: Mesin Speech-to-Text.
5. **FFmpeg**: Pemrosesan Audio.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.
