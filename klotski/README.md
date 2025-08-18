# 🧩 Modern Sliding Puzzle Oyunları

Next.js ile geliştirilmiş modern ve responsive sliding puzzle oyun koleksiyonu. Hem masaüstü hem mobil cihazlarda mükemmel çalışır.

## 🎮 Oyunlar

### 1. Klasik 1-15 Puzzle
- Geleneksel sayı kaydırma oyunu
- 4x4 grid üzerinde 1-15 sayılarını sıralama
- Tıklama ve swipe desteği
- Hamle sayısı takibi

### 2. Klotski Puzzle
- Farklı boyutlarda parçalar ile blok kaydırma oyunu
- Ana parça (♔) çıkışa ulaştırma hedefi
- 20 farklı seviye
- Çeşitli parça tipleri: Ana (2x2), Dikey (1x2), Yatay (2x1), Küçük (1x1)

## 🚀 Canlı Demo

[Vercel'de Görüntüle](https://klotski-ysv3.vercel.app/)

Oynamak isteyenler için: [https://klotski-ysv3.vercel.app/](https://klotski-ysv3.vercel.app/)

## ✨ Özellikler

- **📱 Tam Responsive**: Mobil ve masaüstü uyumlu
- **👆 Touch Desteği**: Parmakla kaydırma (swipe) hareketleri
- **🎨 Modern UI**: Gradient renkler, yumuşak gölgeler, glassmorphism efektleri
- **⚡ Hızlı**: Next.js 14 App Router ile optimize edilmiş
- **🎯 Akıllı Hareket**: Geçersiz hareketleri engelleme
- **📊 İstatistik**: Hamle sayısı ve seviye takibi
- **🏆 Kazanma Animasyonları**: Başarı bildirimleri

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Icons**: Unicode karakterler
- **Deployment**: Vercel

## 🚀 Kurulum

```bash
# Projeyi klonla
git clone <repository-url>
cd sliding-puzzle

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## 🎯 Nasıl Oynanır

### Klasik 1-15 Puzzle
1. Sayıları 1-15 sırasına dizin
2. Boş alana komşu karoları tıklayın veya kaydırın
3. En az hamle ile tamamlamaya çalışın

### Klotski Puzzle
1. Ana parçayı (♔) alt çıkışa götürün
2. Parçaları tıklayıp ok tuşları ile hareket ettirin
3. Mobilde parçaları kaydırarak hareket ettirin
4. 20 seviyeyi tamamlayın

## 🎮 Kontroller

### Masaüstü
- **Mouse**: Parçalara/karolara tıklama
- **Klavye**: Ok tuşları (Klotski'de seçili parça için)

### Mobil
- **Touch**: Dokunma ve kaydırma hareketleri
- **Swipe**: Parçaları istediğiniz yöne kaydırın

## 📱 Responsive Tasarım

- **Mobil**: Kompakt düzen, touch-friendly boyutlar
- **Tablet**: Orta boy ekranlar için optimize
- **Masaüstü**: Geniş ekranlar için büyük oyun alanı

## 🎨 Tasarım Sistemi

- **Renk Paleti**: Purple/Violet gradientler
- **Tipografi**: Modern, ince fontlar
- **Animasyonlar**: Yumuşak geçişler ve hover efektleri
- **Gölgeler**: Soft shadows ile derinlik hissi

## 📦 Build ve Deploy

```bash
# Production build
npm run build

# Build'i test et
npm start

