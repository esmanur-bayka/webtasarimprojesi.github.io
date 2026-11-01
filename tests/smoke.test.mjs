import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
test('approved section order and reference removal',()=>{
 const ids=[...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(ids,['home','experience','certificates','education','services','projects','contact']);
 assert.doesNotMatch(html,/id="flashbacks"|learning-resources/);
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
 assert.match(html,/<span class="sr-only">Web Tasarımı ve Kodlama öğrencisiyim/);
 assert.match(html,/rel="canonical" href="https:\/\/esmanur-bayka.github.io\/webtasarimprojesi.github.io\/"/);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema.name,'Esmanur Bayka');assert.equal(schema['@type'],'Person');
});
