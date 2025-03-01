# GraphQL Form Builder

GraphQL Form Builder, sürükle bırak yöntemiyle form tasarlama ve GraphQL veri kaynaklarıyla entegre etme olanağı sağlayan güçlü bir form oluşturma aracıdır. Özelleştirilebilir stil seçenekleri, önizleme modu ve 20'den fazla form bileşeniyle hızlı ve görsel form tasarımına olanak tanır.

## 🌟 Özellikler

### Form Tasarımı

- **Sürükle Bırak Arayüzü**: Kolay ve görsel tasarım
- **20+ Form Bileşeni**: Metin kutuları, seçim listeleri, kaydırıcılar, dosya yükleme alanları ve daha fazlası
- **Düzen Bileşenleri**: Konteyner, kart, akordiyon, sekmeler ve diğer düzen seçenekleri

### GraphQL Entegrasyonu

- **GraphQL Veri Bağlama**: Formları GraphQL verileriyle bağlama
- **Veri Tabloları**: GraphQL sorguları ile veri tabloları oluşturma
- **Dinamik Veri Gösterimi**: Gerçek zamanlı veri görselleştirme

### Görsel Özelleştirme

- **Gelişmiş Stil Editörü**: Kapsamlı stil özelleştirme
- **Tema Desteği**: Açık/koyu tema
- **Özel CSS**: Tam kontrol için özel CSS ekleme

### Önizleme ve Test

- **Gerçek Zamanlı Önizleme**: Formunuzun nasıl görüneceğini ve çalışacağını anında görün
- **Duyarlı Önizleme**: Masaüstü, tablet ve mobil görünümleri test edin
- **Form Değeri Testi**: Form alanlarını doldurarak test edin

### Proje Yönetimi

- **Projeleri Kaydetme/Yükleme**: LocalStorage tabanlı proje yönetimi
- **Dışa/İçe Aktarma**: Projeleri JSON formatında dışa ve içe aktarma
- **Otomatik Kaydetme**: Tasarım değişikliklerini otomatik kaydetme

## 📋 Kurulum

### Ön Gereksinimler

- Node.js (v14.0.0 veya üzeri)
- npm veya yarn

### Adımlar

1. Repoyu klonlayın:

```bash
git clone https://github.com/yourusername/graphql-form-builder.git
cd graphql-form-builder
```

2. Bağımlılıkları yükleyin:

```bash
npm install
# veya
yarn install
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
# veya
yarn dev
```

4. Tarayıcınızda açın:

```
http://localhost:5173
```

## 🚀 Kullanım

### Yeni Bir Form Oluşturma

1. "Yeni Proje" butonuna tıklayın
2. Proje adı ve açıklaması girin
3. Sol panelden form bileşenlerini çalışma alanına sürükleyin
4. Bileşenleri seçerek sağ panelden özelliklerini düzenleyin

### GraphQL Veri Bağlama

1. Bir veri tablosu bileşeni ekleyin
2. Sağ panelde "GraphQL Veri Kaynağı" bölümünü genişletin
3. GraphQL endpoint'i ve sorguyu girin
4. "Veri Kaynağını Bağla" butonuna tıklayın

### Form Önizleme

1. Üst çubukta "Önizle" butonuna tıklayın
2. Formunuzu test edin ve farklı cihaz boyutlarında görünümünü kontrol edin
3. Düzenlemeye devam etmek için "Düzenle" butonuna tıklayın

### Projeyi Dışa Aktarma

1. Üst çubukta "Dışa Aktar" ikonuna tıklayın
2. JSON dosyası otomatik olarak indirilecektir

## 💻 Teknoloji Yığını

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **UI Kütüphanesi**: Material UI
- **Durum Yönetimi**: Zustand
- **Sürükle Bırak**: React DnD
- **GraphQL İstemcisi**: Apollo Client
- **Yerleşim Düzeni**: React Grid Layout
- **Stil Özelleştirme**: React Color, TinyColor2

## 📐 Proje Yapısı

```
/src
  /components        # UI bileşenleri
    /preview         # Önizleme modu bileşenleri
    /styleEditor     # Stil düzenleme bileşenleri
  /store             # Zustand durum yönetimi
  /services          # Harici servisler (LocalStorage, vb.)
  /types             # TypeScript tip tanımları
  /theme             # Material UI tema yapılandırması
  App.tsx            # Ana uygulama bileşeni
  main.tsx           # Giriş noktası
```

## 👨‍💻 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen şu adımları izleyin:

1. Bu repoyu fork edin
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Dalınıza push yapın (`git push origin feature/amazing-feature`)
5. Bir Pull Request (PR) açın

## 📝 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📬 İletişim

Sorularınız veya geri bildirimleriniz için [GitHub Issues](https://github.com/yourusername/graphql-form-builder/issues) kullanabilirsiniz.

---

Made with ❤️ using React, TypeScript, and GraphQL
