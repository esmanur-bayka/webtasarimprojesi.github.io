(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precise = matchMedia('(hover: hover) and (pointer: fine)');
  const cursor = document.createElement('div');
  cursor.className='theme-cursor'; cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML='<span class="cursor-dot"></span><span class="cursor-ring"></span>';
  document.body.append(cursor);
  function resetCursor(){document.body.classList.remove('custom-pointer');cursor.classList.remove('is-visible','is-link');}
  document.addEventListener('pointermove',event=>{
    if(!precise.matches||reduced.matches||event.pointerType==='touch'){resetCursor();return;}
    const editable=event.target.closest('input,textarea,select,[contenteditable="true"]');
    cursor.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`;
    document.body.classList.toggle('custom-pointer',!editable);
    cursor.classList.toggle('is-visible',!editable);
    cursor.classList.toggle('is-link',!!event.target.closest('a,button,[role="button"]'));
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',resetCursor);
  window.addEventListener('blur',resetCursor);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)resetCursor();});
  document.addEventListener('keydown',event=>{if(event.key==='Tab')resetCursor();});
  reduced.addEventListener('change',resetCursor);precise.addEventListener('change',resetCursor);
  document.addEventListener('pointerdown',event=>{
    if(!precise.matches||reduced.matches||event.pointerType==='touch'||event.button!==0)return;
    const waves=document.querySelectorAll('.click-wave');if(waves.length>=6)waves[0].remove();
    const wave=document.createElement('span');wave.className='click-wave';wave.setAttribute('aria-hidden','true');
    wave.style.left=`${event.clientX}px`;wave.style.top=`${event.clientY}px`;
    document.body.append(wave);wave.addEventListener('animationend',()=>wave.remove(),{once:true});
    setTimeout(()=>wave.remove(),750);
  },{passive:true});
  const cards = [...document.querySelectorAll('.service-box,.project-card,.timeline-content,.home-img,.credential-card,.experience-card')];
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
        card.style.setProperty('--rx', `${(0.5 - y) * 18}deg`);
        card.style.setProperty('--ry', `${(x - 0.5) * 22}deg`);
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

  const color = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim();
  const logo = document.querySelector('.home-img');
  if (logo) {
    const orbits = document.createElement('div');
    orbits.className = 'depth-orbits'; orbits.setAttribute('aria-hidden','true');
    for(let i=0;i<5;i++){const ring=document.createElement('span');ring.style.setProperty('--ring',i);orbits.append(ring);}
    logo.append(orbits);
  }
  const scenes = [];
  let phase=0, last=0, animation=0;
  const vertices = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  function project([x,y,z],a,b,r,cx,cy){
    const xx=x*Math.cos(a)-z*Math.sin(a), zz=x*Math.sin(a)+z*Math.cos(a);
    const yy=y*Math.cos(b)-zz*Math.sin(b), depth=y*Math.sin(b)+zz*Math.cos(b);
    const scale=4/(4+depth*.5);
    return [cx+xx*r*scale,cy+yy*r*scale];
  }
  function draw(scene) {
    const {ctx,w,h,index}=scene;
    ctx.clearRect(0,0,w,h); ctx.strokeStyle=color; ctx.fillStyle=color;
    const mobile=w<700;
    // Perspective floor: all lines converge at a shared vanishing point.
    const horizon=h*.65;
    ctx.lineWidth=.8;ctx.globalAlpha=.25;
    ctx.beginPath();
    for(let i=-8;i<=8;i++) {ctx.moveTo(w*.5+i*9,horizon);ctx.lineTo(w*.5+i*w*.18,h);}
    for(let i=0;i<9;i++){const t=((i/9+phase*.012)%1);const y=horizon+(h-horizon)*t*t;ctx.moveTo(0,y);ctx.lineTo(w,y);}
    ctx.stroke();
    // Real projected wireframe cubes with independent rotation and Z depth.
    const shapes=mobile?3:5;
    for(let i=0;i<shapes;i++){
      const cx=w*(i%2 ? .92 : .065), cy=h*(.17+i*.155);
      const radius=(mobile?22:45)+(i%3)*(mobile?6:16);
      const a=phase*.22+i+index,b=phase*.17+i*.9;
      const pts=vertices.map(v=>project(v,a,b,radius,cx,cy+Math.sin(phase*.6+i)*12));
      ctx.globalAlpha=mobile?.35:.55;ctx.lineWidth=1.2;
      ctx.beginPath();for(const [u,v] of edges){ctx.moveTo(...pts[u]);ctx.lineTo(...pts[v]);}ctx.stroke();
    }
    // A rotating orbital globe around the hero graphic, behind the image.
    if(index===0 && !mobile){
      const r=Math.min(w*.21,235), cx=w*.82,cy=h*.49;
      ctx.globalAlpha=.4;ctx.lineWidth=.8;
      for(let lat=-2;lat<=2;lat++){
        ctx.beginPath();
        for(let n=0;n<=72;n++){
          const t=n*Math.PI/36, y=lat*.32, rr=Math.sqrt(1-y*y);
          const point=project([Math.cos(t)*rr,y,Math.sin(t)*rr],phase*.12,.45,r,cx,cy);
          n?ctx.lineTo(...point):ctx.moveTo(...point);
        }ctx.stroke();
      }
      for(let i=0;i<6;i++){
        ctx.beginPath();for(let n=0;n<=72;n++){
          const t=n*Math.PI/36,a=i*Math.PI/6;
          const pt=project([Math.cos(t)*Math.cos(a),Math.sin(t),Math.cos(t)*Math.sin(a)],phase*.12,.45,r,cx,cy);
          n?ctx.lineTo(...pt):ctx.moveTo(...pt);
        }ctx.stroke();
      }
    }
    const count=mobile?15:42;
    for(let i=0;i<count;i++){
      const x=((i*137.31+Math.sin(phase*.13+i)*14)%w+w)%w;
      const y=((i*79.73+phase*(i%3+1)*2)%h+h)%h;
      ctx.globalAlpha=.2+(i%4)*.13;ctx.beginPath();ctx.arc(x,y,i%5===0?2:1,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  function tick(time){
    if(document.hidden||reduced.matches){animation=0;last=0;return;}
    if(!scenes.some(s=>s.visible)){animation=0;last=0;return;}
    if(!last || time-last>=33){
      if(last)phase+=Math.min(time-last,100)/1000;
      last=time;for(const scene of scenes)if(scene.visible)draw(scene);
    }
    animation=requestAnimationFrame(tick);
  }
  function sync(){
    cancelAnimationFrame(animation);animation=0;last=0;
    if(reduced.matches){for(const s of scenes)s.ctx.clearRect(0,0,s.w,s.h);return;}
    if(!document.hidden&&scenes.some(s=>s.visible))animation=requestAnimationFrame(tick);
  }
  document.querySelectorAll('section').forEach((section,index)=>{
    section.classList.add('depth-section');
    const canvas=document.createElement('canvas');canvas.className='depth-scene';canvas.setAttribute('aria-hidden','true');section.prepend(canvas);
    const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
    const scene={ctx,w:1,h:1,index,visible:false};scenes.push(scene);
    new ResizeObserver(()=>{
      scene.w=section.clientWidth;scene.h=Math.min(section.clientHeight,1400);
      const ratio=Math.min(devicePixelRatio||1,1.25);
      canvas.width=Math.round(scene.w*ratio);canvas.height=Math.round(scene.h*ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);if(!reduced.matches)draw(scene);
    }).observe(section);
    new IntersectionObserver(entries=>{scene.visible=entries[0].isIntersecting;sync();}).observe(section);
  });
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
})();
