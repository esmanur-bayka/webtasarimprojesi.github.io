import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const css=readFileSync(new URL('style.css',root),'utf8');
const cv=readFileSync(new URL('cv.html',root),'utf8');
test('approved section order and reference removal',()=>{
 const ids=[...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(ids,['home','experience','certificates','education','services','projects','contact']);
 assert.doesNotMatch(html,/id="flashbacks"|learning-resources/);
});
test('requested copy, metadata and CV content are present',()=>{
 for(const copy of [
  'Merhaba, ben Esmanur Bayka.',
  'Web Tasarımı ve Kodlama öğrencisi · 2. sınıf',
  'Gönüllü haber yazarı',
  'Seçilmiş haberlerim',
  'Eğitimler ve <span>sertifikalar</span>',
  'Diller ve',
  'Seçilmiş',
  'İletişime',
  'E-posta taslağı oluştur',
  'Esmanur Bayka | Web Geliştirme Portföyü',
 ]) assert.ok(html.includes(copy),copy);
 for(const phrase of [
  'Web arayüzleri geliştiriyorum',
  'React üzerine çalışıyorum',
  'Siber güvenliği takip ediyorum',
  'Teknoloji haberleri yazıyorum',
 ]) assert.ok(css.includes(`content: "${phrase}"`),phrase);
 assert.match(html,/data-certificate-filter="training"[^>]*>Eğitimler ve rozetler/);
 assert.match(html,/data-certificate-filter="participation"[^>]*>Etkinlik katılımları/);
 assert.equal((html.match(/>PDF’yi görüntüle/g)||[]).length,14);
 assert.equal((html.match(/>Belgeyi görüntüle/g)||[]).length,1);
 assert.equal((html.match(/>Belgeyi indir/g)||[]).length,15);
 assert.equal((html.match(/>Rozeti doğrula/g)||[]).length,1);
 assert.match(cv,/window\.print\(\)/);
 for(const copy of [
  'Web Tasarımı ve Kodlama öğrencisi · 2. sınıf',
  'Visual Studio Code · GitHub · XAMPP · Temel Git bilgisi',
  'Siber Havadis · Gönüllü haber yazarı',
  'BTK Akademi B2 Seviye İngilizce eğitimi — Nisan 2026.',
 ]) assert.ok(cv.includes(copy),copy);
 assert.doesNotMatch(`${html}\n${cv}`,/staj arıyorum|iş arıyorum|beni işe alın/i);
});
test('all local certificate and CV resources exist',()=>{
 const paths=[...html.matchAll(/(?:href|src)="((?:certificates\/[^"?]+|cv.html))"/g)].map(m=>m[1]);
 assert.ok(paths.length>30);
 for(const path of paths)assert.ok(existsSync(new URL(path,root)),path);
 assert.equal((html.match(/class="credential-card certificate-entry"/g)||[]).length,15);
});
test('no empty navigation links and all anchors resolve',()=>{
 assert.doesNotMatch(html,/href="#"/);
 for(const [,id]of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${id}"`),id);
});

test('accessible landmarks, stable role text and truthful sharing metadata',()=>{
 assert.match(html,/<main id="main-content" tabindex="-1">/);
 assert.match(html,/class="skip-link" href="#main-content"/);
 assert.match(html,/<span class="sr-only">Web arayüzleri geliştiriyorum\. React üzerine çalışıyorum\./);
 assert.match(html,/rel="canonical" href="https:\/\/esmanur-bayka.github.io\/webtasarimprojesi.github.io\/"/);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema.name,'Esmanur Bayka');assert.equal(schema['@type'],'Person');
});
