import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../script.js", import.meta.url), "utf8");
test("Dil, viewport, SEO ve gerçek gezinme hedefleri", () => {
  assert.match(html, /<html lang="tr">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /rel="canonical"/);
  for (const id of ["home","education","services","projects","contact"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
    assert.match(html, new RegExp('href="#' + id + '"'));
  }
});
test("Sahte CV ve ölü sosyal bağlantıları yok", () => {
  assert.doesNotMatch(html, /href="#"/);
  assert.doesNotMatch(html, /href="[^"]*CV\.pdf"/i);
  assert.doesNotMatch(html, /<h2[^>]*>Referanslar<\/h2>/);
});
test("Mobil menü erişilebilir ve Escape ile kapanır", () => {
  assert.match(html, /<button[^>]+id="menu-icon"[^>]+aria-controls="navbar"[^>]+aria-expanded="false"/);
  assert.match(js, /event\.key === "Escape"/);
  assert.match(js, /focusin/);
});
test("Form otomatik gönderim yapmaz, WhatsApp taslağı hazırlar", () => {
  assert.match(html, /Bu form bir sunucuya veri göndermez/);
  assert.match(html, /id="contact-name"[^>]+required/);
  assert.match(html, /id="contact-message"[^>]+required/);
  assert.match(js, /wa\.me\/905467710162\?text=/);
  assert.match(js, /event\.preventDefault\(\)/);
});
test("Görünür odak ve hareket azaltma sağlanır", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /outline:\s*none/);
});
