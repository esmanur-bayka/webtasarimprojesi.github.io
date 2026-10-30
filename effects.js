(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precise = matchMedia('(hover: hover) and (pointer: fine)');
  const cards = [...document.querySelectorAll('.service-box,.flashback-item,.project-card,.timeline-content,.home-img')];
  for (const card of cards) {
    card.classList.add('depth-card');
    let frame = 0;
    function reset() {
      cancelAnimationFrame(frame);
      card.classList.remove('depth-active');
      card.style.removeProperty('--rx'); card.style.removeProperty('--ry');
    }
    card.addEventListener('pointermove', event => {
      if (reduced.matches || !precise.matches || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        card.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
        card.style.setProperty('--ry', `${(x - 0.5) * 12}deg`);
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.classList.add('depth-active');
      });
    }, { passive: true });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    reduced.addEventListener('change', reset);
    precise.addEventListener('change', reset);
  }

  const hero = document.querySelector('.home');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'depth-scene';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const color = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim();
  const vertices = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  const edges = [];
  for (let a=0; a<6; a++) for (let b=a+1; b<6; b++) if (Math.floor(a/2)!==Math.floor(b/2)) edges.push([a,b]);
  let width=1, height=1, animation=0, visible=false, phase=0, last=0;
  function resize() {
    width=hero.clientWidth; height=hero.clientHeight;
    const ratio=Math.min(devicePixelRatio || 1, 1.5);
    canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
    draw();
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    ctx.strokeStyle=color; ctx.lineWidth=1;
    const count=width<700?3:7;
    for(let i=0;i<count;i++) {
      const angle=phase*.16+i*.87, tilt=phase*.11+i;
      const radius=width<700?18:25+(i%3)*12;
      const cx=width*(.08+((i*.137)% .87)), cy=height*(.14+((i*.223)% .72));
      const points=vertices.map(([x,y,z])=>{
        const xx=x*Math.cos(angle)-z*Math.sin(angle), zz=x*Math.sin(angle)+z*Math.cos(angle);
        const yy=y*Math.cos(tilt)-zz*Math.sin(tilt), depth=y*Math.sin(tilt)+zz*Math.cos(tilt);
        const projection=3/(3+depth*.35);
        return [cx+xx*radius*projection,cy+yy*radius*projection];
      });
      ctx.globalAlpha=.15+(i%3)*.09;
      ctx.beginPath();
      for(const [a,b] of edges){ctx.moveTo(...points[a]);ctx.lineTo(...points[b]);}
      ctx.stroke();
    }
    ctx.globalAlpha=1;
  }
  function tick(time) {
    if(!visible || document.hidden || reduced.matches){animation=0;last=0;return;}
    if(last) phase+=Math.min(time-last,50)/1000;
    last=time; draw(); animation=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(animation); animation=0; last=0;
    if(reduced.matches){ctx.clearRect(0,0,width,height);return;}
    if(visible && !document.hidden) animation=requestAnimationFrame(tick);
  }
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(hero);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  resize();
})();
