# 📁 Emare Ulak — Dosya Yapısı

> **Oluşturulma:** Otomatik  
> **Amaç:** Yapay zekalar kod yazmadan önce mevcut dosya yapısını incelemeli

---

## Proje Dosya Ağacı

```
/Users/emre/Desktop/Emare/emareulak
├── .gitignore
├── DOSYA_YAPISI.md
├── EMARE_AI_COLLECTIVE.md
├── EMARE_ANAYASA.md
├── EMARE_ORTAK_CALISMA -> /Users/emre/Desktop/Emare/EMARE_ORTAK_CALISMA
├── EMARE_ORTAK_HAFIZA.md
├── Neural_Network_OS
│   ├── 0_Proje_Ozeti.md
│   ├── 1_Vizyon_ve_Mimariler.md
│   ├── 2_Teknik_Bilesenler.md
│   ├── 3_UI_UX_Tasarimi.md
│   ├── 4_Gelistirme_Araclari.md
│   ├── 5_Gereksinimler.md
│   ├── 6_Roadmap.md
│   ├── 7_Risk_Analizi.md
│   ├── 8_Kaynak_Plani.md
│   └── 9_Sonuclar_Ve_Oneriler.md
├── README.md
├── archive
│   ├── .DS_Store
│   ├── Microsoft.VisualStudio.Services.VSIXPackage
│   ├── Neural_Network_OS.zip
│   ├── emare-ulak-extension-complete (1).zip
│   ├── emare-ulak-extension-complete.zip
│   └── emare-ulak-extension.zip
├── backup
│   ├── app.js.backup
│   ├── background.js
│   ├── content.js
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
├── demos
│   └── neural_ui_demo.html
├── docs
│   ├── EMARE_AI_COLLECTIVE.md
│   ├── EMARE_ORTAK_HAFIZA.md
│   └── emareulak_hafiza.md
├── emare-ulak-extension
│   ├── background.js
│   ├── content.js
│   ├── emare-ulak-icon-128.png
│   ├── emare-ulak-icon-48.png
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
├── icons
│   ├── 20250726_0834_Kurumsal Minimal Logo Tasarımı_simple_compose_01k12kj11defpvrpsxendfgz9w.png
│   ├── emare-ulak-icon-128 2.png
│   ├── emare-ulak-icon-128.png
│   ├── emare-ulak-icon-48 (1).png
│   └── emare-ulak-icon-48.png
├── public
│   └── dashboard.html
└── server
    ├── package-lock.json
    ├── package.json
    └── server.js

11 directories, 48 files

```

---

## 📌 Kullanım Talimatları (AI İçin)

Bu dosya, kod üretmeden önce projenin mevcut yapısını kontrol etmek içindir:

1. **Yeni dosya oluşturmadan önce:** Bu ağaçta benzer bir dosya var mı kontrol et
2. **Yeni klasör oluşturmadan önce:** Mevcut klasör yapısına uygun mu kontrol et
3. **Import/require yapmadan önce:** Dosya yolu doğru mu kontrol et
4. **Kod kopyalamadan önce:** Aynı fonksiyon başka dosyada var mı kontrol et

**Örnek:**
- ❌ "Yeni bir auth.py oluşturalım" → ✅ Kontrol et, zaten `app/auth.py` var mı?
- ❌ "config/ klasörü oluşturalım" → ✅ Kontrol et, zaten `config/` var mı?
- ❌ `from utils import helper` → ✅ Kontrol et, `utils/helper.py` gerçekten var mı?

---

**Not:** Bu dosya otomatik oluşturulmuştur. Proje yapısı değiştikçe güncellenmelidir.

```bash
# Güncelleme komutu
python3 /Users/emre/Desktop/Emare/create_dosya_yapisi.py
```
