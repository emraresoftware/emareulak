# 🧠 Emare Ulak — Proje Hafıza Dosyası

> 🔗 **Ortak Hafıza:** [`EMARE_ORTAK_HAFIZA.md`](/Users/emre/Desktop/Emare/EMARE_ORTAK_HAFIZA.md) — Tüm Emare ekosistemi, sunucu bilgileri, standartlar ve proje envanteri için bak.

> **Son Güncelleme:** 4 Mart 2026  
> **Durum:** Development  
> **Proje:** Browser extension + WebSocket server — Chat izleyici ve analiz sistemi

---

## 📋 Proje Nedir?

**Emare Ulak**, tarayıcı üzerindeki sohbet uygulamalarını (WhatsApp Web, Telegram Web, Discord vb.) izleyen ve analiz eden bir Chrome/Edge extension + backend sunucu kombinasyonudur.

### Temel Özellikler
- Browser extension (Chrome/Edge)
- WebSocket tabanlı gerçek zamanlı veri aktarımı
- Sohbet mesajlarını yakalama ve izleme
- SQLite ile mesaj depolama
- Express.js backend server
- Chart.js ile veri görselleştirme
- Dashboard (popup.html)

---

## 🏗️ Mimari

```
emareulak/
├── manifest.json              # Chrome extension manifest
├── background.js              # Extension arka plan scripti
├── content.js                 # Sayfa içeriğine enjekte edilen script
├── popup.html                 # Extension popup UI
├── popup.js                   # Popup logic
├── server.js                  # Express.js backend server
├── package.json               # Node.js dependencies
├── public/                    # Static files
└── emare-ulak-extension/      # Paketlenmiş extension
```

---

## 🔧 Teknoloji

### Frontend (Extension)
- **Vanilla JavaScript** (Chrome Extension APIs)
- **HTML/CSS** (popup UI)
- **Chart.js** (grafik gösterimi)

### Backend (Server)
- **Node.js + Express.js**
- **WebSocket (ws package)** — gerçek zamanlı iletişim
- **SQLite3** — mesaj depolama
- **CORS** — cross-origin requests

---

## 🚀 Kullanım

### Extension Yükleme

1. Chrome/Edge'de `chrome://extensions` aç
2. "Developer mode" aktif et
3. "Load unpacked" → `emare-ulak-extension/` klasörünü seç

### Server Başlatma

```bash
cd /Users/emre/Desktop/Emare/emareulak
npm install
node server.js
# WebSocket sunucusu: ws://127.0.0.1:8080
```

### Kullanım Akışı

1. Extension yükle
2. Server'ı başlat
3. WhatsApp Web / Telegram Web gibi bir sohbet uygulamasına gir
4. Extension otomatik olarak mesajları yakalayıp server'a gönderir
5. Dashboard'dan (extension popup) istatistikleri gör

---

## 📡 WebSocket API

### Client → Server

```json
{
  "type": "message",
  "platform": "whatsapp",
  "sender": "John Doe",
  "content": "Merhaba!",
  "timestamp": 1709539200
}
```

### Server → Client

```json
{
  "type": "stats",
  "total_messages": 1523,
  "today": 87,
  "platforms": {
    "whatsapp": 1200,
    "telegram": 323
  }
}
```

---

## 🗄️ Veritabanı (SQLite)

```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT,
    sender TEXT,
    content TEXT,
    timestamp INTEGER
);

CREATE TABLE stats (
    date TEXT PRIMARY KEY,
    message_count INTEGER
);
```

---

## 🎨 UI Bileşenleri

### Extension Popup
- Bugünkü mesaj sayısı
- Platform dağılımı (Chart.js pie chart)
- Son 24 saat trend grafiği
- Server bağlantı durumu

---

## 📦 Dependencies

```json
{
  "express": "^5.1.0",
  "ws": "^8.18.3",
  "sqlite3": "^5.1.7",
  "cors": "^2.8.5",
  "chart.js": "^4.5.0"
}
```

---

## 🔄 Durum

**Tamamlandı:**
- ✅ Extension manifest
- ✅ Content script (mesaj yakalama)
- ✅ WebSocket server
- ✅ SQLite entegrasyonu
- ✅ Popup UI

**Devam Eden:**
- 🔄 Chart.js entegrasyonu
- 🔄 Multi-platform desteği (WhatsApp, Telegram, Discord)

**Planlanan:**
- 📅 AI destekli mesaj analizi
- 📅 Sentiment analizi
- 📅 Otomatik yanıt önerileri
- 📅 Web dashboard (ayrı sayfa)

---

## 🐛 Bilinen Sorunlar

- Extension bazı sayfalarda DOM değişikliklerini kaçırabiliyor → MutationObserver iyileştirmesi yapılacak
- WebSocket bağlantısı kesildiğinde otomatik yeniden bağlanma eksik

---

## 📝 Notlar

- Extension sadece Chromium tabanlı tarayıcılarda çalışır (Chrome, Edge, Brave)
- Server yerel olarak (localhost:8080) çalışıyor, production için HTTPS gerekli
- Privacy: Mesajlar sadece lokal SQLite'da saklanıyor, dışarıya gönderilmiyor

---

*Son güncelleyen: Copilot (4 Mart 2026)*
