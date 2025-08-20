# 📰 AI News – Portal Berita Artificial Intelligence

**AI News** adalah portal berita berbasis web yang secara otomatis menampilkan berita terbaru seputar Artificial Intelligence dari berbagai sumber terpercaya. Dibangun menggunakan React + Tailwind CSS, proyek ini dirancang agar cepat, responsif, dan mudah digunakan.

Live demo: 👉 [https://ai-news-self.vercel.app/](https://ai-news-self.vercel.app/)

---

## ✨ Fitur Utama

- 🔄 Mengambil berita terbaru dari **3 public APIs**:
  - GNews API
  - The New York Times API
  - The Guardian API

- 🧠 Menampilkan:
  - Judul berita
  - Tautan ke artikel asli
  - Waktu publikasi
  - Deskripsi singkat & gambar (jika tersedia)
  - Sumber dan penulis berita

- 🔍 **Fitur Pencarian**: cari berita berdasarkan kata kunci seperti “robot”, “machine learning”, dsb.

- 🗂️ **Filter Sumber**: tampilkan berita dari semua atau salah satu sumber.

- ⚡ **Cache Otomatis**:
  - Caching di memory dan localStorage
  - Fallback ke cache jika fetch gagal

- 📱 **Desain responsif**: optimal di desktop dan mobile.

- ✨ Animasi scroll menggunakan AOS.

---

## 🛠️ Teknologi

- [React (Vite)](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- LocalStorage (untuk caching)
- JavaScript (ES6+)
