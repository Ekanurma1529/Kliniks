"use client";

import { FormEvent, useMemo, useState } from "react";

type View = "dashboard" | "pasien" | "janji" | "telegram" | "pengaturan";

const nav: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "pasien", label: "Pasien", icon: "♙" },
  { id: "janji", label: "Janji Temu", icon: "▣" },
  { id: "telegram", label: "Pesan Telegram", icon: "➤" },
  { id: "pengaturan", label: "Pengaturan", icon: "⚙" },
];

const patients = [
  ["PS-001", "Anita Rahmawati", "0812 4455 8821", "Periksa umum", "Aktif"],
  ["PS-002", "Dewi Lestari", "0857 1109 3321", "Kontrol", "Aktif"],
  ["PS-003", "Fajar Pratama", "0813 9981 2400", "Konsultasi", "Baru"],
  ["PS-004", "Rina Handayani", "0821 5510 7734", "Pemeriksaan", "Aktif"],
];

const appointments = [
  ["08:00", "Anita Rahmawati", "dr. Budi Santoso", "Selesai"],
  ["09:30", "Dewi Lestari", "dr. Budi Santoso", "Selesai"],
  ["11:00", "Fajar Pratama", "dr. Siti Aisyah", "Berlangsung"],
  ["13:00", "Rina Handayani", "dr. Siti Aisyah", "Menunggu"],
  ["14:30", "Agus Setiawan", "dr. Budi Santoso", "Menunggu"],
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState("");
  const [botActive, setBotActive] = useState(true);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✚</span><div><strong>Klinik Sehat</strong><small>Melayani dengan hati</small></div></div>
        <nav>{nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
        <div className="account"><span className="avatar">A</span><div><strong>Admin Klinik</strong><small>Administrator</small></div><button onClick={() => setLoggedIn(false)} title="Keluar">↗</button></div>
      </aside>
      <main className="main">
        <header className="topbar"><div><p className="eyebrow">KLINIK SEHAT • ADMIN</p><h1>{view === "dashboard" ? "Selamat datang, Admin" : nav.find((n) => n.id === view)?.label}</h1><p>Kelola layanan klinik dan komunikasi pasien dalam satu tempat.</p></div><button className="primary" onClick={() => setModal(true)}>＋ Tambah Pasien</button></header>

        {view === "dashboard" && <Dashboard botActive={botActive} onAppointments={() => setView("janji")} onTelegram={() => setView("telegram")} />}
        {view === "pasien" && <Patients />}
        {view === "janji" && <Appointments />}
        {view === "telegram" && <Telegram botActive={botActive} setBotActive={setBotActive} notify={notify} />}
        {view === "pengaturan" && <Settings notify={notify} />}
      </main>
      {modal && <PatientModal onClose={() => setModal(false)} onSave={() => { setModal(false); notify("Pasien baru berhasil disimpan"); }} />}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);
  function submit(e: FormEvent) { e.preventDefault(); setLoading(true); window.setTimeout(onLogin, 550); }
  return <main className="login-page"><section className="login-art"><div className="login-brand"><span className="brand-mark">✚</span><div><strong>Klinik Sehat</strong><small>Panel layanan terpadu</small></div></div><div className="art-copy"><span className="pill">● Telegram bot siap membantu</span><h1>Layanan klinik lebih cepat, rapi, dan responsif.</h1><p>Kelola pasien, janji temu, dan pesan otomatis dari satu dashboard yang aman.</p></div><div className="art-stats"><div><b>98%</b><span>Respons bot</span></div><div><b>24/7</b><span>Layanan pesan</span></div><div><b>1.248</b><span>Pasien terdata</span></div></div></section><section className="login-panel"><form onSubmit={submit}><span className="mobile-logo">✚</span><p className="eyebrow">SELAMAT DATANG</p><h2>Masuk ke akun klinik</h2><p className="muted">Gunakan akun admin yang terdaftar di Supabase.</p><label>Email<input type="email" defaultValue="admin@kliniksehat.id" required /></label><label>Kata sandi<input type="password" defaultValue="demo1234" required /></label><div className="login-row"><label className="check"><input type="checkbox" defaultChecked /> Ingat saya</label><a href="#">Lupa kata sandi?</a></div><button className="primary login-button" disabled={loading}>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</button><p className="demo-note">Mode demo aktif — klik masuk untuk melihat dashboard.</p></form></section></main>;
}

function Dashboard({ botActive, onAppointments, onTelegram }: { botActive: boolean; onAppointments: () => void; onTelegram: () => void }) {
  return <><section className="stats"><Stat icon="♟" label="Total Pasien" value="1.248" note="+24 dari minggu lalu" tone="blue" /><Stat icon="▣" label="Janji Hari Ini" value="18" note="+5 dari kemarin" tone="cyan" /><Stat icon="▤" label="Pesan Bot" value="256" note="+36 dari kemarin" tone="green" /></section><section className="dashboard-grid"><article className="card schedule"><div className="card-head"><div><p className="eyebrow">OPERASIONAL</p><h2>Jadwal Hari Ini</h2></div><button className="link" onClick={onAppointments}>Lihat semua</button></div><AppointmentTable compact /></article><article className="card bot-card"><div className="card-head"><div><p className="eyebrow">AUTOMASI</p><h2>Bot Telegram</h2></div><span className={botActive ? "status online" : "status"}>{botActive ? "● Aktif" : "● Nonaktif"}</span></div><div className="telegram-hero"><span className="telegram-logo">➤</span><div><strong>{botActive ? "Terhubung dan merespons" : "Bot sedang dinonaktifkan"}</strong><p>Webhook aman dan balasan otomatis berjalan normal.</p></div></div><div className="mini-stats"><div><b>256</b><span>Pesan hari ini</span></div><div><b>28</b><span>Pengguna baru</span></div><div><b>98%</b><span>Tingkat respons</span></div></div><div className="reply"><span>Balasan otomatis terbaru</span><p>“Terima kasih telah menghubungi Klinik Sehat. Silakan sebutkan nama dan kebutuhan Anda.”</p></div><button className="secondary full" onClick={onTelegram}>Kelola Bot Telegram</button></article></section></>;
}

function Stat({ icon, label, value, note, tone }: { icon: string; label: string; value: string; note: string; tone: string }) { return <article className="stat-card"><span className={`stat-icon ${tone}`}>{icon}</span><div><span>{label}</span><b>{value}</b><small>{note}</small></div><span className="trend">↗</span></article>; }

function AppointmentTable({ compact = false }: { compact?: boolean }) { const data = compact ? appointments : [...appointments, ["16:00", "Citra Devina", "dr. Siti Aisyah", "Terjadwal"]]; return <div className="table-wrap"><table><thead><tr><th>Waktu</th><th>Pasien</th><th>Dokter</th><th>Status</th></tr></thead><tbody>{data.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={cell}>{i === 3 ? <span className={`tag ${cell.toLowerCase()}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div>; }
function Patients() { return <section className="card page-card"><div className="card-head"><div><p className="eyebrow">DATABASE PASIEN</p><h2>Daftar Pasien</h2></div><input className="search" placeholder="Cari nama pasien…" /></div><div className="table-wrap"><table><thead><tr><th>ID</th><th>Nama</th><th>Telepon</th><th>Kunjungan</th><th>Status</th></tr></thead><tbody>{patients.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={c}>{i === 4 ? <span className="tag selesai">{c}</span> : c}</td>)}</tr>)}</tbody></table></div></section>; }
function Appointments() { return <section className="card page-card"><div className="card-head"><div><p className="eyebrow">3 AGUSTUS 2026</p><h2>Jadwal Janji Temu</h2></div><button className="secondary">＋ Buat Jadwal</button></div><AppointmentTable /></section>; }

function Telegram({ botActive, setBotActive, notify }: { botActive: boolean; setBotActive: (v: boolean) => void; notify: (s: string) => void }) {
  const [answer, setAnswer] = useState("Terima kasih telah menghubungi Klinik Sehat. Admin kami akan segera membantu. Untuk membuat janji, kirim: JANJI [nama] [tanggal].");
  const chars = useMemo(() => answer.length, [answer]);
  return <section className="settings-grid"><article className="card page-card"><div className="card-head"><div><p className="eyebrow">KONEKSI</p><h2>Bot Telegram</h2></div><label className="switch"><input type="checkbox" checked={botActive} onChange={(e) => setBotActive(e.target.checked)} /><span /></label></div><div className="connection"><span className="telegram-logo">➤</span><div><b>@KlinikSehatBot</b><p className="muted">Webhook terhubung • pemeriksaan terakhir baru saja</p></div><span className={botActive ? "status online" : "status"}>{botActive ? "● Aktif" : "● Nonaktif"}</span></div><label>Balasan otomatis<textarea rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} /><small className="field-note">{chars}/1000 karakter</small></label><div className="actions"><button className="primary" onClick={() => notify("Pengaturan bot berhasil disimpan")}>Simpan Perubahan</button><button className="secondary" onClick={() => notify("Pesan uji berhasil dikirim")}>Kirim Pesan Uji</button></div></article><article className="card side-help"><p className="eyebrow">ALUR PESAN</p><h2>Respons otomatis</h2><ol><li><b>Pasien mengirim pesan</b><span>Telegram meneruskan pesan ke webhook.</span></li><li><b>Sistem membaca pengaturan</b><span>Supabase menyimpan template balasan.</span></li><li><b>Bot membalas otomatis</b><span>Respons dikirim dalam hitungan detik.</span></li></ol></article></section>;
}

function Settings({ notify }: { notify: (s: string) => void }) { return <section className="card page-card form-card"><p className="eyebrow">PROFIL KLINIK</p><h2>Pengaturan Umum</h2><div className="form-grid"><label>Nama klinik<input defaultValue="Klinik Sehat" /></label><label>Nomor telepon<input defaultValue="021 555 0198" /></label><label>Email<input defaultValue="admin@kliniksehat.id" /></label><label>Jam operasional<input defaultValue="Senin–Sabtu, 08:00–20:00" /></label></div><label>Alamat<textarea rows={3} defaultValue="Jl. Kesehatan No. 28, Jakarta" /></label><button className="primary" onClick={() => notify("Profil klinik berhasil diperbarui")}>Simpan Pengaturan</button></section>; }

function PatientModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) { return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal" onSubmit={(e) => { e.preventDefault(); onSave(); }} onMouseDown={(e) => e.stopPropagation()}><div className="card-head"><div><p className="eyebrow">DATA BARU</p><h2>Tambah Pasien</h2></div><button type="button" className="close" onClick={onClose}>×</button></div><label>Nama lengkap<input required placeholder="Contoh: Siti Rahma" /></label><div className="form-grid"><label>Nomor telepon<input required placeholder="08xx xxxx xxxx" /></label><label>Tanggal lahir<input type="date" required /></label></div><label>Keluhan awal<textarea rows={3} placeholder="Tuliskan keluhan singkat pasien" /></label><div className="actions"><button type="button" className="secondary" onClick={onClose}>Batal</button><button className="primary">Simpan Pasien</button></div></form></div>; }
