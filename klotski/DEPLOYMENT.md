# 🚀 Vercel Deployment Rehberi

Bu rehber, Modern Sliding Puzzle oyununuzu Vercel'e nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Ön Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- [Git](https://git-scm.com/)
- [Vercel CLI](https://vercel.com/cli) (opsiyonel)
- Vercel hesabı ([vercel.com](https://vercel.com))

## 🎯 Hızlı Deployment (GitHub ile)

### 1. GitHub Repository Oluşturma
```bash
# Projeyi GitHub'a push edin
git add .
git commit -m "Initial commit: Modern Sliding Puzzle"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/sliding-puzzle.git
git push -u origin main
```

### 2. Vercel'e Import Etme
1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. "Import" butonuna tıklayın
5. Ayarları varsayılan olarak bırakın (Next.js otomatik algılanır)
6. "Deploy" butonuna tıklayın

### 3. Otomatik Deployment
- Her `main` branch'e push otomatik deployment tetikler
- Pull Request'ler preview deployment oluşturur

## 🛠️ CLI ile Deployment

### 1. Vercel CLI Kurulumu
```bash
npm i -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. İlk Deployment
```bash
# Proje klasöründe
vercel

# Soruları yanıtlayın:
# ? Set up and deploy "~/sliding-puzzle"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? sliding-puzzle
# ? In which directory is your code located? ./
```

### 4. Production Deployment
```bash
vercel --prod
```

## ⚙️ Yapılandırma Dosyaları

Proje aşağıdaki yapılandırma dosyalarını içerir:

### `vercel.json`
- Build ve runtime ayarları
- Security headers
- Cache ayarları
- Avrupa (Frankfurt) bölgesi

### `.vercelignore`
- Deploy edilmeyecek dosyalar
- Node modules, logs, temp dosyalar

## 📦 Build Süreci

Vercel otomatik olarak:
1. `npm install` - Dependencies yükleme
2. `npm run build` - Next.js build
3. Static dosyaları optimize etme
4. CDN'e dağıtım

## 🔧 Özel Ayarlar

### Environment Variables
Eğer environment variable'lar gerekiyorsa:
```bash
# Vercel dashboard'da Project Settings > Environment Variables
# veya CLI ile:
vercel env add VARIABLE_NAME
```

### Custom Domain
```bash
vercel domains add your-domain.com
```

## 📊 Monitoring

### Analytics
- Vercel Dashboard'da otomatik analytics
- Sayfa görüntüleme, performans metrikleri
- Real User Monitoring (RUM)

### Logs
```bash
vercel logs
```

## 🚀 Deployment Komutları

```bash
# Geliştirme
npm run dev

# Build test
npm run build
npm run start

# Preview deployment
npm run preview
# veya
vercel

# Production deployment  
npm run deploy
# veya
vercel --prod
```

## 🔍 Sorun Giderme

### Build Hataları
```bash
# Local build test
npm run build

# Vercel logs
vercel logs --follow
```

### Performance
- Next.js Image Optimization otomatik aktif
- Static dosyalar CDN'de cache
- Automatic code splitting

### Common Issues
1. **Node version**: Package.json'da engine belirtme
2. **Build timeout**: Vercel'de varsayılan 60s
3. **Memory limit**: Hobby plan 1GB RAM

## 📱 Domain Örnekleri

Deploy edildikten sonra URL'ler:
- `https://sliding-puzzle-username.vercel.app`
- `https://your-custom-domain.com`

## 🎯 Sonraki Adımlar

1. Custom domain bağlama
2. Analytics kurulumu
3. Performance monitoring
4. SEO optimizasyonu

---

**İpucu**: Her commit otomatik deploy edilir. Stable sürümler için git tag kullanın.

```bash
git tag v1.0.0
git push origin v1.0.0
``` 