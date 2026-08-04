"use client";

import { FormEvent, useState } from "react";

type Page = "beranda" | "daftar" | "antrean" | "riwayat";

const services = [
  ["✚", "Poli Umum", "Pemeriksaan umum"],
  ["◉", "Poli Gigi", "Perawatan gigi"],
  ["♡", "Poli Anak", "Kesehatan anak"],
  ["✦", "Poli Kandungan", "Ibu & kandungan"],
];

const histories = [
  { date: "18", month: "JUL 2026", clinic: "Poli Umum", title: "Infeksi Saluran Pernapasan Akut", doctor: "dr. Nadia Putri", complaint: "Batuk, pilek, dan demam selama tiga hari.", action: "Pemeriksaan fisik dan tekanan darah.", medicine: "Paracetamol 500 mg · 3×1\nAmbroxol 30 mg · 3×1", note: "Istirahat cukup dan kontrol jika demam berlanjut." },
  { date: "02", month: "MEI 2026", clinic: "Poli Gigi", title: "Karies Gigi Geraham", doctor: "drg. Amalia Sari", complaint: "Nyeri pada gigi geraham kanan bawah.", action: "Pembersihan dan penambalan sementara.", medicine: "Asam mefenamat 500 mg · bila nyeri", note: "Kontrol kembali 09 Mei 2026." },
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("beranda");
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const bpjs = String(data.get("bpjs") ?? "").replace(/\D/g, "");
    const password = String(data.get("password") ?? "");
    if (bpjs.length >= 8 && password.length >= 6) setLoggedIn(true);
  }

  if (!loggedIn) return <Login onSubmit={login} showPassword={showPassword} togglePassword={() => setShowPassword((value) => !value)} />;

  return <main className="portal">
    <header className="header">
      <Logo />
      <nav>{[["beranda","Beranda"],["daftar","Pendaftaran"],["antrean","Antrean Saya"],["riwayat","Riwayat Pengobatan"]].map(([id,label]) => <button key={id} className={page === id ? "active" : ""} onClick={() => { setPage(id as Page); if (id === "daftar") setModal(true); }}>{label}</button>)}</nav>
      <div className="profile"><span>AR</span><div><strong>Aulia Rahman</strong><small>BPJS ·•••• 4281</small></div><button onClick={() => setLoggedIn(false)}>↪</button></div>
    </header>

    <div className="content">
      {page === "riwayat" ? <History /> : <>
        <section className="hero"><div><p>SELAMAT DATANG KEMBALI</p><h1>Halo, Aulia 👋</h1><span>Bagaimana kabar Anda hari ini? Kami siap membantu kebutuhan kesehatan Anda.</span></div><div className="date"><small>Selasa</small><strong>04</strong><span>Agustus 2026</span></div></section>
        <section className="actions">
          <button onClick={() => setModal(true)}><i>＋</i><div><strong>Daftar Kunjungan</strong><small>Pilih dokter & jadwal</small></div><b>→</b></button>
          <button onClick={() => setPage("antrean")}><i>⌁</i><div><strong>Cek Antrean</strong><small>Lihat posisi antrean</small></div><b>→</b></button>
          <a href="https://t.me/" target="_blank" rel="noreferrer"><i>➤</i><div><strong>Chat Asisten AI</strong><small>Tanya layanan 24 jam</small></div><b>→</b></a>
        </section>
        <div className="grid">
          <div className="left">
            <section className="card"><Title eyebrow="LAYANAN KAMI" title="Pilih Poliklinik" /><div className="services">{services.map(([icon,title,note]) => <button key={title} onClick={() => setModal(true)}><i>{icon}</i><strong>{title}</strong><small>{note}</small><b>→</b></button>)}</div></section>
            <section className="card"><div className="title-row"><Title eyebrow="JADWAL ANDA" title="Kunjungan Mendatang" /><span className="confirmed">✓ Terkonfirmasi</span></div><div className="appointment"><div className="day"><strong>06</strong><span>AGU</span></div><div className="doctor">NP</div><div><small>Poli Umum</small><strong>dr. Nadia Putri</strong><span>Kamis, 06 Agustus 2026 · 09:00 WIB</span></div><button>Detail</button></div></section>
          </div>
          <aside>
            <section className="card queue"><div className="title-row"><Title eyebrow="ANTREAN HARI INI" title="Posisi Antrean" /><span className="live">● Live</span></div><div className="number"><small>NOMOR ANDA</small><strong>A-017</strong><span>Poli Umum · dr. Nadia Putri</span></div><div className="bar"><i /></div><p className="queue-meta"><span>Sedang dilayani <b>A-012</b></span><span>5 antrean lagi</span></p><div className="estimate">◷ <span><small>Estimasi dipanggil</small><strong>± 35 menit lagi</strong></span></div></section>
            <section className="assistant"><div><i>✦</i><span><strong>Asisten Sehat AI</strong><small>● Online · respons cepat</small></span></div><p>Halo Aulia! Ada yang bisa saya bantu terkait jadwal, antrean, atau layanan klinik? 👋</p><a href="https://t.me/" target="_blank" rel="noreferrer">Buka Chat Telegram <b>➤</b></a></section>
          </aside>
        </div>
      </>}
    </div>

    <nav className="mobile-nav">{[["beranda","⌂","Beranda"],["daftar","＋","Daftar"],["antrean","⌁","Antrean"],["riwayat","▤","Riwayat"]].map(([id,icon,label]) => <button key={id} onClick={() => { setPage(id as Page); if (id === "daftar") setModal(true); }}><span>{icon}</span>{label}</button>)}</nav>
    {modal && <Booking success={success} onClose={() => { setModal(false); setSuccess(false); }} onSubmit={() => setSuccess(true)} />}
  </main>;
}

function Login({ onSubmit, showPassword, togglePassword }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; showPassword: boolean; togglePassword: () => void }) {
  return <main className="login"><section className="login-art"><Logo light /><div><p>LAYANAN KESEHATAN DIGITAL</p><h1>Lebih dekat dengan<br />kesehatan Anda.</h1><span>Daftar kunjungan, cek antrean, riwayat pengobatan, dan konsultasi AI dalam satu tempat.</span><aside><b>24/7<small>Asisten AI</small></b><b>4<small>Poliklinik</small></b><b>~3 dtk<small>Respons cepat</small></b></aside></div></section><section className="login-panel"><form onSubmit={onSubmit}><div className="mobile-logo"><Logo /></div><em>✓ Portal Pasien Aman</em><h2>Selamat datang</h2><p>Masuk menggunakan nomor kartu BPJS dan kata sandi Anda.</p><label>Nomor Kartu BPJS<div className="field"><span>BPJS</span><input name="bpjs" aria-label="Nomor Kartu BPJS" inputMode="numeric" minLength={8} placeholder="Masukkan nomor kartu BPJS" required /></div></label><small>Nomor BPJS terdiri dari 13 digit angka</small><div className="password-label"><label>Kata Sandi</label><a href="#">Lupa kata sandi?</a></div><div className="field password"><span>●</span><input name="password" aria-label="Kata Sandi" type={showPassword ? "text" : "password"} minLength={6} placeholder="Masukkan kata sandi" required /><button type="button" onClick={togglePassword}>{showPassword ? "◉" : "◎"}</button></div><small>Minimal 6 karakter</small><button className="login-button">Masuk ke Portal <b>→</b></button><p className="safe">🔒 Data Anda dilindungi dan digunakan hanya untuk pelayanan kesehatan.</p></form></section></main>;
}

function Logo({ light = false }: { light?: boolean }) { return <div className={`logo ${light ? "light" : ""}`}><span>✦</span><div><strong>Klinik Sehat</strong><small>Care in every moment</small></div></div>; }
function Title({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="section-title"><small>{eyebrow}</small><h2>{title}</h2></div>; }

function History() { return <section className="history"><div className="history-head"><Title eyebrow="REKAM MEDIS PASIEN" title="Riwayat Pengobatan" /><button>Unduh Riwayat ↓</button></div><p>Catatan kunjungan, diagnosis, tindakan, dan resep obat Anda.</p><div className="summary"><span>AR</span><div><small>Nama Pasien</small><strong>Aulia Rahman</strong><i>No. BPJS ·•••• 4281</i></div><div><small>Golongan Darah</small><strong>O+</strong></div><div><small>Alergi</small><strong>Penisilin</strong></div></div><div className="history-list">{histories.map((item) => <article key={item.month}><div className="history-date"><strong>{item.date}</strong><span>{item.month}</span></div><div className="history-body"><span className="tag">{item.clinic}</span><span className="done">Selesai</span><h3>{item.title}</h3><p><b>Dokter:</b> {item.doctor}</p><div className="details"><div><small>Keluhan</small><p>{item.complaint}</p></div><div><small>Tindakan</small><p>{item.action}</p></div><div><small>Resep Obat</small><p>{item.medicine}</p></div><div><small>Catatan Dokter</small><p>{item.note}</p></div></div></div></article>)}</div></section>; }

function Booking({ success, onClose, onSubmit }: { success: boolean; onClose: () => void; onSubmit: () => void }) { return <div className="backdrop" onMouseDown={onClose}><section className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={onClose}>×</button>{success ? <div className="success"><i>✓</i><h2>Pendaftaran berhasil!</h2><p>Nomor antrean dan pengingat jadwal akan dikirim melalui Telegram.</p><button onClick={onClose}>Kembali ke Beranda</button></div> : <><p className="modal-kicker">PENDAFTARAN ONLINE</p><h2>Buat Jadwal Kunjungan</h2><p>Pilih layanan dan waktu yang paling nyaman.</p><form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><label>Poliklinik<select required defaultValue=""><option value="" disabled>Pilih poliklinik</option>{services.map((service) => <option key={service[1]}>{service[1]}</option>)}</select></label><label>Dokter<select required defaultValue=""><option value="" disabled>Pilih dokter</option><option>dr. Nadia Putri</option><option>dr. Reza Mahendra</option><option>drg. Amalia Sari</option></select></label><div><label>Tanggal<input type="date" required /></label><label>Jam<select required defaultValue=""><option value="" disabled>Pilih jam</option><option>08:00</option><option>09:00</option><option>10:30</option></select></label></div><label>Keluhan singkat<textarea placeholder="Tuliskan keluhan utama Anda..." /></label><button>Konfirmasi Pendaftaran <b>→</b></button></form></>}</section></div>; }
