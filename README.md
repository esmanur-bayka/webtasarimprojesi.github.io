# Esmanur Bayka · Kişisel Portföy

HTML5, CSS3 ve vanilla JavaScript ile hazırlanmış kişisel web portföyü. **Bu repo bir öğrenme projesidir**; doğrulanmamış müşteri yorumları ve örnek hizmet iddiaları yerine gerçek GitHub çalışmalarına bağlantı verir.

## Projeyi çalıştırma
1. Repoyu klonlayın veya indirin.
2. `index.html` dosyasını tarayıcıda açın; isterseniz VS Code Live Server kullanın.
3. Google Fonts için internet bağlantısı faydalıdır; bağlantı olmadan sistem yazı tipine geçer. Derleme veya backend gerekmez.

## Dosyalar
- `index.html`: Semantik bölümler, proje bağlantıları ve etiketli iletişim alanları.
- `style.css`: Mobil öncelikli düzen, görünür klavye odağı, azaltılmış hareket tercihi.
- `script.js`: Mobil menü, Escape ile kapatma ve WhatsApp mesaj taslağı.
- `img/`: Favicon ve önceki çalışmadan kalan görseller.
- `tests/smoke.test.mjs`: Node.js yerleşik test çalıştırıcısıyla kaynak denetimleri.
- `.github/workflows/quality.yml`: GitHub Actions temel denetimi.

## Gerçek projeler
- [FocusBoard](https://github.com/esmanur-bayka/focusboard): React ile görev yönetimi ve otomatik test çalışması.
- Bu portföy: Responsive HTML/CSS ve erişilebilir JavaScript gezinme.

## İletişim ve CV sınırı
İletişim formu **mesajı bir sunucuya göndermez**. Girilen bilgiler WhatsApp'ta önceden doldurulmuş bir mesaj taslağına aktarılır. Kullanıcı, WhatsApp üzerinden **Gönder** demeden mesaj iletilmez. Formun çalışması WhatsApp erişimine bağlıdır. Kayıtlı veriler bu sitede depolanmaz.

Doğrulanmış bir özgeçmiş PDF dosyası bulunmadığından çalışmayan CV bağlantısı kaldırılmıştır. PDF hazır olduğunda belgeyi repoya ekleyip yeni bağlantı açın.

## Test / kalite
`node --test tests/*.test.mjs` komutu kaynak odaklı duman testlerini çalıştırır. Bu testler gerçek tarayıcı veya cihaz testi yerine geçmez.

**Gerçek cihazda manuel kontrol (henüz doğrulanmış test sonucu değildir):**
- 375 px, 768 px ve 1280 px: yatay taşma, başlıkların okunabilirliği, proje kartları ve iletişim alanı.
- Dar ekranda menü: Tab/Enter/Space/Escape, bağlantıya tıklayınca kapanma ve `aria-expanded`.
- Klavye odağı: Bütün bağlantıların ve form girişlerinin görünür odağı.
- Ekran okuyucu: Bölüm başlıkları, menü ve form etiketleri.
- WhatsApp akışı: Eksik alan kontrolü, kullanıcı onayından önce otomatik gönderim olmaması.
- Harici bağlantılar, gizlilik ve bağlantı hedeflerinin son kontrolü.

## Teknolojiler ve geliştirici
HTML5 · CSS3 · JavaScript · GitHub Actions

Esmanur Bayka — Atatürk Üniversitesi, Web Tasarımı ve Kodlama.

[GitHub](https://github.com/esmanur-bayka) · [LinkedIn](https://www.linkedin.com/in/lynapgrl/)

## Tek kişisel portföy

Resmî portföy için bu tek depoyu kullan: https://esmanur-bayka.github.io/webtasarimprojesi.github.io/

Diğer portföy denemeleri ayrı yayınlar olarak kullanılmamalıdır. `focusboard` bir portföy sitesi değil, React görev yönetimi projesidir. Bu sitede gerçek ve belgelenmiş çalışmalar yer alır.

## Tarayıcı testleri

```sh
npm install
npx playwright install chromium
npm test
npm run test:e2e
```

Playwright testleri 375, 768 ve 1280 px genişliklerde taşmayı; mobil menüde klavye kullanımı, gerçek bağlantılar ve iletişim doğrulamasını kontrol eder. CI sonucu gerçek çalıştırmadan sonra değerlendirilmelidir.
