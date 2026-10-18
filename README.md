# DropLink

Situs katalog rekomendasi link affiliate berbahasa Indonesia. Link terbaru otomatis ditampilkan paling atas.

## Jalankan lokal

Buka `index.html` di browser. Sebelum Supabase dikonfigurasi, katalog berjalan dalam mode pratinjau. Isi data katalog melalui Supabase setelah backend dikonfigurasi.

## Aktifkan penyimpanan bersama

1. Buat proyek di [Supabase](https://supabase.com/).
2. Buka SQL Editor, jalankan seluruh isi `schema.sql`.
3. Buka Project Settings → API, salin Project URL dan anon/public key.
4. Isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `config.js`. Jangan gunakan `service_role` key.

## Deploy

Folder ini adalah situs statis. Unggah folder `affiliate-drop` ke Netlify, Cloudflare Pages, Vercel, atau GitHub Pages. Untuk Netlify/Vercel, pilih folder ini sebagai project root; tidak perlu build command. Pastikan `config.js` sudah diisi sebelum deploy agar semua pengunjung melihat daftar yang sama.

Kebijakan database saat ini mengizinkan publik membaca dan mengirim link melalui API. Antarmuka situs hanya menampilkan katalog rekomendasi.
