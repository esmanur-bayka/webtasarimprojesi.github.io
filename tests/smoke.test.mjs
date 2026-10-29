import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../script.js", import.meta.url), "utf8");

test("sayfanın temel dil ve viewport bilgisi bulunur", () => {
  assert.match(html, /<html lang="tr">/);
  assert.match(html, /name="viewport"/);
});
test("ana gezinme hedefleri bulunur", () => {
  for (const id of ["home","about","projects","skills","contact"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
    assert.match(html, new RegExp('href="#' + id + '"'));
  }
});
test("boş yer tutucu bağlantı veya sahte CV butonu bulunmaz", () => {
  assert.doesNotMatch(html, /href="#"/);
  assert.doesNotMatch(html, /href="[^"]*CV\.pdf"/i);
});
test("mobil menü erişilebilir olarak işaretlenir", () => {
  assert.match(html, /<button[^>]+id="menu-toggle"[^>]+aria-controls="navbar"[^>]+aria-expanded="false"/);
  assert.match(js, /event\.key === "Escape"/);
});
test("form gerçek gönderim vaadinde bulunmaz", () => {
  assert.match(html, /Bu form bir sunucuya veri göndermez/);
  assert.match(js, /wa\.me\/905467710162/);
  assert.match(html, /id="contact-name"[^>]+required/);
  assert.match(html, /id="contact-message"[^>]+required/);
});
test("odak ve azaltılmış hareket desteklenir", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /outline:\s*none/);
});
