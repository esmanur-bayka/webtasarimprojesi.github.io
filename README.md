# Esmanur Bayka — kişisel portfolyo

Özgün siyah-kırmızı tasarım, görseller ve sayfa yapısı korunarak erişilebilirlik, güvenilir içerik ve kalite testleri iyileştirildi.

Canlı site: https://esmanur-bayka.github.io/webtasarimprojesi.github.io/

## Gerçek proje ve referans sınırı
Buradaki çalışmalar kişisel öğrenme projeleridir. Doğrulanmamış müşteri değerlendirmeleri ve ticari teslimat iddiaları gösterilmez. FocusBoard ve bu portföyün kaynak kodu gerçek GitHub bağlantılarıyla sunulur.

## CV sınırı
Doğrulanmış bir CV PDF dosyası sağlanmadığından CV indirme düğmesi bulunmaz. PDF hazır olduğunda dosya eklenip çalışan bağlantı yayınlanmalıdır.

## İletişim ve gizlilik
İletişim alanı backend değildir, verileri bu sitede kaydetmez. Alanlar doldurulduktan sonra WhatsApp'ta mesaj **taslağı** açılır; kullanıcı WhatsApp'tan Gönder'e basmadıkça mesaj iletilmez. Alternatif iletişim için GitHub ve LinkedIn bağlantıları vardır.

## Test
```sh
npm install
npx playwright install chromium
npm test
npm run test:e2e
```

GitHub Actions kalite workflow'u her PR ve main push işleminde temel kaynak testlerini ve Chromium/Playwright tarayıcı kontrollerini çalıştırır. Playwright 375, 768, 1280 px yatay taşmayı, mobil menünün klavye kullanımını, proje bağlantılarını ve iletişim taslağını denetler.

## Yayın öncesi manuel doğrulama
- 375/768/1280 px ekranlarda yatay taşma, görsel kırpılma ve okunabilirlik
- Gerçek mobil cihaz, farklı tarayıcılar ve ekran okuyucu
- GitHub/LinkedIn/Instagram/WhatsApp bağlantı hedefleri, mesaj taslağının kullanıcı onayı
- CV PDF'si olmadan sahte indirilebilir dosya iddiası bulunmaması

Bu test kapsamı bütün cihaz ve erişilebilirlik senaryolarının yerine geçmez.
