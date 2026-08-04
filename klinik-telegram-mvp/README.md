# Klinik Sehat + Telegram

MVP dashboard klinik dengan antarmuka login, pasien, janji temu, pengaturan bot, serta webhook Telegram. Siap dipasang di Vercel dan menggunakan Supabase sebagai autentikasi/database.

## Variabel Vercel

Tambahkan di **Project Settings → Environment Variables**:

- `GEMINI_API_KEY`: API key dari Google AI Studio.
- `GEMINI_MODEL`: opsional, default `gemini-2.5-flash`.
- `N8N_WEBHOOK_URL`: Production URL dari node Webhook n8n.
- `N8N_WEBHOOK_SECRET`: opsional; dikirim sebagai header `x-kliniks-secret`.
- `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_WEBHOOK_SECRET`: untuk bot Telegram.

Pendaftaran pasien dikirim ke n8n melalui endpoint server `/api/webhook/n8n`. Chat web dan balasan bot Telegram menggunakan Gemini melalui server, sehingga API key tidak dikirim ke browser.

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env.local` dan isi nilainya.
2. Jalankan `supabase.sql` melalui SQL Editor Supabase.
3. Jalankan `npm install` lalu `npm run dev`.

## Menghubungkan Telegram

Buat bot melalui `@BotFather`, simpan token sebagai `TELEGRAM_BOT_TOKEN`, lalu daftarkan webhook:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "content-type: application/json" \
  -d '{"url":"https://DOMAIN-VERCEL/api/telegram/webhook","secret_token":"SECRET_YANG_SAMA_DENGAN_ENV"}'
```

## Deploy GitHub → Vercel

Push folder ini ke repository GitHub. Import repository tersebut di Vercel, tambahkan semua variabel dari `.env.example`, lalu deploy. Setelah domain aktif, jalankan perintah `setWebhook` di atas memakai domain Vercel.

Catatan: login di UI saat ini menggunakan mode demo untuk peninjauan desain. Endpoint dan skema backend sudah disiapkan; sambungkan form login ke Supabase Auth sebelum dipakai untuk data pasien asli.
