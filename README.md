# Esmanur Bayka — kişisel portföy

Özgün siyah-kırmızı tasarım, görseller ve sayfa yapısı korunarak erişilebilirlik, güvenilir içerik ve kalite testleri iyileştirildi.

Canlı site: https://esmanur-bayka.github.io/webtasarimprojesi.github.io/

## Gerçek proje ve referans sınırı
Buradaki çalışmalar kişisel öğrenme projeleridir. Doğrulanmamış müşteri değerlendirmeleri ve ticari teslimat iddiaları gösterilmez. FocusBoard ve bu portföyün kaynak kodu gerçek GitHub bağlantılarıyla sunulur.

## CV ve iletişim
`cv.html` tarayıcıdan incelenebilir ve yazdırılabilir; hazır bir PDF indirme bağlantısı değildir.
İletişim formu e-posta uygulamasında taslak hazırlar. Gönderme işlemini kullanıcı tamamlar; site mesajları saklamaz. Doğrudan e-posta, GitHub, Instagram ve WhatsApp bağlantıları bulunur.

## Test
```sh
npm install
npx playwright install chromium
npm test
npm run test:e2e
```

GitHub Actions kalite workflow'u her PR ve main push işleminde temel kaynak testlerini ve Chromium/Playwright tarayıcı kontrollerini çalıştırır. Playwright 360, 390, 575, 768, 896, 1024, 1280 px yatay taşmayı, mobil menünün klavye kullanımını, sertifika filtrelerini, belge bağlantılarını, atlama bağlantısını ve aktif menü durumunu denetler.

## Yayın öncesi manuel doğrulama
- 360/390/575/768/896/1024/1280 px ekranlarda yatay taşma, görsel kırpılma ve okunabilirlik
- Gerçek mobil cihaz, farklı tarayıcılar ve ekran okuyucu
- GitHub/Instagram/WhatsApp/e-posta bağlantı hedefleri, mesaj taslağının kullanıcı onayı
- CV PDF'si olmadan sahte indirilebilir dosya iddiası bulunmaması

Bu test kapsamı bütün cihaz ve erişilebilirlik senaryolarının yerine geçmez.


## Erişilebilirlik ve paylaşım
Ana içeriğe atlama bağlantısı, main alanı, kararlı rol metni, mantıklı başlık sırası ve isimlendirilmiş ikon bağlantıları bulunur. Aktif bölüm `aria-current` ile belirtilir. Siyah-kırmızı palet korunurken koyu kırmızı üzerindeki düğme yazıları beyazdır. Canonical, Open Graph, Twitter Card ve gerçek profil bilgilerine dayanan Person verisi eklenmiştir. CV arama keşfi kapsamına ayrıca eklenmemiştir.
Gerçek ekran okuyucu, gerçek mobil cihaz ve Lighthouse ölçümü bu otomatik kontrollerden ayrı yapılmalıdır.
