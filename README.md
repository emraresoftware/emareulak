# Emare Ulak Projesi

Bu proje, web verilerini toplayan ve analiz eden bir Chrome uzantısı ile sunucu uygulamasını içerir.

## Proje Yapısı

```
├── emare-ulak-extension/   # Chrome uzantısı (Ana Extension Klasörü)
│   ├── manifest.json       # Uzantı yapılandırma dosyası
│   ├── background.js       # Arka plan service worker
│   ├── content.js          # İçerik scripti
│   ├── popup.html          # Popup arayüzü
│   ├── popup.js            # Popup mantığı
│   └── *.png               # Uzantı iconları
│
├── server/                 # Backend sunucu
│   ├── server.js           # Express sunucu
│   ├── package.json        # Sunucu bağımlılıkları
│   └── node_modules/       # Yüklü paketler
│
├── public/                 # Web arayüzü
│   └── dashboard.html      # Dashboard sayfası
│
├── Neural_Network_OS/      # Neural Network OS proje dokümantasyonu
│   └── *.md                # Proje belgeleri (Vizyon, Mimari, Roadmap, vb.)
│
├── docs/                   # Proje dokümantasyonu
│   ├── EMARE_AI_COLLECTIVE.md
│   ├── EMARE_ORTAK_HAFIZA.md
│   └── emareulak_hafiza.md
│
├── demos/                  # Demo ve test dosyaları
│   └── neural_ui_demo.html
│
├── icons/                  # Icon ve görsel dosyalar
│   └── *.png
│
├── backup/                 # Yedek dosyalar
├── archive/                # Arşivlenmiş dosyalar (.zip, eski sürümler)
│
├── .gitignore              # Git ignore yapılandırması
└── README.md               # Bu dosya
```

## Kurulum

### Chrome Uzantısı
1. Chrome'da `chrome://extensions/` sayfasını açın
2. "Geliştirici modu"nu etkinleştirin
3. "Paketlenmemiş öğe yükle" butonuna tıklayın
4. `emare-ulak-extension/` klasörünü seçin

### Sunucu
```bash
cd server
npm install
node server.js
```

## Kullanım

Uzantı yüklendikten sonra herhangi bir web sayfasını ziyaret ettiğinizde otomatik olarak veri toplama başlar.

## İletişim

Emare AI Projesi - 2026
