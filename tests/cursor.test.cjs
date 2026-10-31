const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup() {
  const events = {};
  const windowEvents = {};
  function element() {
    const classes = new Set();
    return { style: {}, setAttribute() {}, innerHTML: '',
      classList: {
        add: (...names) => names.forEach(n => classes.add(n)),
        remove: (...names) => names.forEach(n => classes.delete(n)),
        contains: n => classes.has(n),
        toggle: (n, on) => on ? classes.add(n) : classes.delete(n),
      } };
  }
  const body = element(); let cursor;
  body.append = node => { cursor = node; };
  const document = {
    body, hidden: false, createElement: element,
    documentElement: { addEventListener: (name, cb) => { events[name] = cb; } },
    addEventListener: (name, cb) => { events[name] = cb; },
  };
  const source = fs.readFileSync(path.join(__dirname, '../effects.js'), 'utf8');
  const prefix = source.slice(0, source.indexOf('  const cards =')) + '\n})();';
  vm.runInNewContext(prefix, { document,
    window: { addEventListener: (name, cb) => { windowEvents[name] = cb; } },
    matchMedia: query => ({ matches: query.includes('hover: hover'), addEventListener() {} }),
  });
  const move = (x,y,editable=false) => events.pointermove({ clientX:x, clientY:y, pointerType:'mouse',
    target: { closest: selector => selector.startsWith('input') ? editable : false } });
  return { body, cursor, events, windowEvents, move };
}

test('cursor resumes at the latest position after window blur', () => {
  const s=setup(); s.move(12,20); s.windowEvents.blur(); s.move(240,310);
  assert.equal(s.cursor.style.transform,'translate3d(240px,310px,0)');
  assert.equal(s.cursor.classList.contains('is-visible'),true);
});
test('cursor resumes after leaving the page and keyboard navigation', () => {
  const s=setup(); s.move(5,6); s.events.pointerleave(); s.move(80,90);
  s.events.keydown({key:'Tab'}); assert.equal(s.body.classList.contains('custom-pointer'),false);
  s.move(180,190); assert.equal(s.cursor.style.transform,'translate3d(180px,190px,0)');
  assert.equal(s.body.classList.contains('custom-pointer'),true);
});
test('text inputs keep their native cursor and movement resumes on exit', () => {
  const s=setup(); s.move(30,40,true);
  assert.equal(s.cursor.classList.contains('is-visible'),false);
  assert.equal(s.body.classList.contains('custom-pointer'),false);
  s.move(100,110); assert.equal(s.cursor.classList.contains('is-visible'),true);
});
