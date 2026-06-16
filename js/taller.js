'use strict';
/* ============================================================
   Manufaktur Porsche · Módulo de distribución del taller
   Plano 2D animado + recorrido guiado + vista 3D (Three.js)
   Datos embebidos (funciona offline). Cotas en metros.
   ============================================================ */

const CATS = {
  mecanica:     {label:'Mecánica / electromecánica', stroke:'#3b82f6', fill:'rgba(59,130,246,.18)', solid:'#2f6fe0'},
  chapa:        {label:'Chapa y preparación',        stroke:'#f59e0b', fill:'rgba(245,158,11,.16)', solid:'#d98a1a'},
  pintura:      {label:'Cabina de pintura',          stroke:'#14b8a6', fill:'rgba(20,184,166,.18)', solid:'#159e90'},
  lavado:       {label:'Lavado / entrega',           stroke:'#06b6d4', fill:'rgba(6,182,212,.18)',  solid:'#1093ad'},
  oficina:      {label:'Oficina / atención cliente', stroke:'#22c55e', fill:'rgba(34,197,94,.16)',  solid:'#22a657'},
  instalaciones:{label:'Almacén / instalaciones',    stroke:'#94a3b8', fill:'rgba(148,163,184,.15)',solid:'#6b7686'},
  aseos:        {label:'Aseos / vestuarios',         stroke:'#a78bfa', fill:'rgba(167,139,250,.16)',solid:'#8a6fe0'},
  circulacion:  {label:'Circulación / maniobra',     stroke:'#64748b', fill:'rgba(100,116,139,.07)',solid:'#3a4150', dashed:true}
};

const PLANS = {
  '250': {
    w:12.5, h:20, wLabel:'12,50 m', hLabel:'20,00 m',
    flag:'Esc. 1:100 · 12,5×20 m', tag:'3 mecánicos · 3 elevadores',
    gates:[{x:5.7,w:3.0,label:'Portón seccional · 3 m'}],
    surfaces:[
      ['Taller mecánico + maniobra','≈ 150 m²'],
      ['Chapa y pintura','≈ 55 m²'],
      ['Oficina / cliente / aseos','≈ 28 m²'],
      ['Almacén / instalaciones','≈ 17 m²'],
      ['TOTAL CONSTRUIDO','250 m²']
    ],
    zones:[
      {id:'oficina',  name:'Oficina / recepción', cat:'oficina',       x:9.0, y:15.7, w:3.5, h:3.95, h3d:2.7, desc:'Atención al cliente y entrega. La cara visible del taller.'},
      {id:'mec1',     name:'Mecánica general',    cat:'mecanica',      x:4.9, y:0.5,  w:3.3, h:6.0,  h3d:3.2, lift:1, desc:'Mantenimiento, frenos y distribución. Elevador de 2 columnas.'},
      {id:'electro',  name:'Electromecánica / diagnosis', cat:'mecanica', x:6.7, y:7.0, w:5.5, h:3.5, h3d:3.2, lift:2, note:'Estación PIWIS', desc:'Diagnosis electrónica con PIWIS. Elevador de 2 columnas.'},
      {id:'alinea',   name:'Alineación / geometría', cat:'mecanica',   x:6.7, y:10.8, w:5.5, h:4.0,  h3d:3.2, lift:3, desc:'Alineación y geometría de dirección. Elevador de 4 columnas.'},
      {id:'pintura',  name:'Cabina de pintura',   cat:'pintura',       x:0.4, y:0.5,  w:4.1, h:7.0,  h3d:3.6, note:'Presurizada · 4,1×7 m', desc:'Cabina presurizada con horno de secado. Zona crítica de chapa-pintura.'},
      {id:'chapa',    name:'Chapa y preparación', cat:'chapa',         x:0.4, y:11.6, w:4.1, h:3.0,  h3d:3.0, note:'Bancada + lijado', desc:'Bancada de tiro y tren de lijado para carrocería.'},
      {id:'mezclas',  name:'Sala de mezclas',     cat:'chapa',         x:0.4, y:7.7,  w:2.0, h:2.0,  h3d:2.8, desc:'Preparación y pesaje de pintura.'},
      {id:'inflam',   name:'Pintura / inflamables', cat:'instalaciones', x:0.4, y:9.85, w:2.0, h:1.55, h3d:2.8, desc:'Almacén de pinturas e inflamables, separado por normativa.'},
      {id:'compresor',name:'Compresor · residuos · aceites', cat:'instalaciones', x:8.45, y:4.9, w:3.05, h:1.55, h3d:2.8, desc:'Compresor, gestión de residuos y aceites usados.'},
      {id:'almacen',  name:'Almacén repuestos',   cat:'instalaciones', x:0.4, y:15.7, w:3.1, h:3.95, h3d:2.8, desc:'Stock de repuestos y consumibles.'},
      {id:'vestuario',name:'Aseo / vestuario',    cat:'aseos',         x:3.6, y:15.7, w:1.9, h:3.95, h3d:2.7, desc:'Aseo y vestuario del personal.'},
      {id:'wc',       name:'WC cliente',          cat:'aseos',         x:11.55,y:15.85,w:0.85,h:1.35, h3d:2.7, desc:'Aseo de clientes.'},
      {id:'maniobra', name:'Zona de maniobra',    cat:'circulacion',   x:4.6, y:6.65, w:2.0, h:8.95, h3d:0.05, desc:'Pasillo central de acceso a los elevadores.'}
    ]
  },
  '500': {
    w:25, h:20, wLabel:'25,00 m', hLabel:'20,00 m',
    flag:'Esc. 1:100 · 25×20 m', tag:'3 mecánicos · 5 elevadores · lavado',
    gates:[{x:9.05,w:3.45,label:'Portón mecánica · 3,5 m'},{x:18.85,w:2.45,label:'Portón chapa · 2,5 m'}],
    surfaces:[
      ['Taller mecánico + maniobra','≈ 235 m²'],
      ['Chapa, pintura y lavado','≈ 130 m²'],
      ['Recepción / oficinas / aseos','≈ 60 m²'],
      ['Almacenes / instalaciones','≈ 45 m²'],
      ['Circulación general','≈ 30 m²'],
      ['TOTAL CONSTRUIDO','500 m²']
    ],
    zones:[
      {id:'recepEspera',name:'Recepción / sala de espera', cat:'oficina', x:0.4, y:15.65, w:4.55, h:4.05, h3d:2.7, desc:'Recepción y sala de espera del cliente.'},
      {id:'ofiJefe', name:'Oficina jefe de taller', cat:'oficina',      x:5.05, y:15.65, w:2.3, h:4.05, h3d:2.7, desc:'Despacho del jefe de taller.'},
      {id:'mecA',    name:'Mecánica general',    cat:'mecanica',        x:0.6,  y:0.5,  w:3.5, h:6.2, h3d:3.2, lift:1, desc:'Mecánica general. Elevador de 2 columnas.'},
      {id:'mecB',    name:'Mecánica general',    cat:'mecanica',        x:4.4,  y:0.5,  w:3.5, h:6.2, h3d:3.2, lift:2, desc:'Mecánica general. Elevador de 2 columnas.'},
      {id:'electro', name:'Electromecánica',     cat:'mecanica',        x:8.2,  y:0.5,  w:3.5, h:6.2, h3d:3.2, lift:3, note:'Diagnosis PIWIS', desc:'Diagnosis PIWIS. Elevador de 2 columnas.'},
      {id:'alinea',  name:'Alineación / geometría', cat:'mecanica',     x:0.6,  y:8.4,  w:4.1, h:6.3, h3d:3.2, lift:4, desc:'Alineación y geometría. Elevador de 4 columnas.'},
      {id:'recepRapida',name:'Recepción / servicio rápido', cat:'mecanica', x:8.4, y:9.2, w:3.6, h:5.4, h3d:3.2, note:'Sin elevador', desc:'Recepción y servicio rápido a suelo, sin elevador.'},
      {id:'pintura', name:'Cabina de pintura',   cat:'pintura',         x:15.3, y:0.5,  w:3.9, h:7.1, h3d:3.6, note:'Drive-through 3,9×7,1', desc:'Cabina drive-through con horno de secado.'},
      {id:'prepara', name:'Preparación (tijera)', cat:'chapa',          x:15.3, y:7.8,  w:3.9, h:5.2, h3d:3.0, lift:5, desc:'Preparación de chapa sobre elevador de tijera.'},
      {id:'lavado',  name:'Lavado / entrega',    cat:'lavado',          x:15.3, y:13.2, w:3.9, h:2.1, h3d:3.0, desc:'Lavado y entrega final del vehículo.'},
      {id:'lijado',  name:'Preparación / lijado', cat:'chapa',          x:21.4, y:0.5,  w:3.2, h:4.0, h3d:3.0, note:'Combi + extracción', desc:'Preparación y lijado con extracción.'},
      {id:'chapaBanc',name:'Chapa / bancada',    cat:'chapa',           x:21.4, y:4.7,  w:3.2, h:4.3, h3d:3.0, desc:'Bancada de tiro para carrocería.'},
      {id:'labColor',name:'Laboratorio de color', cat:'instalaciones',  x:21.4, y:9.2,  w:3.2, h:2.3, h3d:2.8, desc:'Laboratorio de color para igualar pintura.'},
      {id:'inflam',  name:'Pintura / inflamables', cat:'instalaciones', x:21.4, y:11.7, w:3.2, h:2.1, h3d:2.8, desc:'Pinturas e inflamables, separado por normativa.'},
      {id:'herrPorsche',name:'Herramienta especial Porsche', cat:'instalaciones', x:12.0, y:1.4, w:1.75, h:4.4, h3d:2.8, desc:'Herramienta y útiles específicos de Porsche.'},
      {id:'almRepuestos',name:'Almacén repuestos + altillo', cat:'instalaciones', x:14.3, y:15.65, w:2.35, h:4.05, h3d:2.8, desc:'Almacén de repuestos con altillo.'},
      {id:'salaTecnica',name:'Sala técnica · compresor', cat:'instalaciones', x:16.7, y:15.65, w:2.0, h:4.05, h3d:2.8, desc:'Sala técnica y compresor.'},
      {id:'almConsum',name:'Almacén consumibles / residuos', cat:'instalaciones', x:21.45, y:15.65, w:3.15, h:4.05, h3d:2.8, desc:'Consumibles y gestión de residuos.'},
      {id:'aseosCli',name:'Aseos cliente',       cat:'aseos',           x:7.45, y:15.65, w:1.55, h:4.05, h3d:2.7, desc:'Aseos de cliente.'},
      {id:'vestuario',name:'Vestuario personal', cat:'aseos',           x:12.55,y:15.65, w:1.7, h:4.05, h3d:2.7, desc:'Vestuario del personal.'},
      {id:'maniobraC',name:'Zona de maniobra',   cat:'circulacion',     x:4.9,  y:6.9,  w:3.3, h:7.7, h3d:0.05, desc:'Pasillo central de circulación y maniobra.'},
      {id:'maniobraR',name:'Zona de maniobra',   cat:'circulacion',     x:19.3, y:0.5,  w:2.0, h:14.8, h3d:0.05, desc:'Pasillo lateral de acceso a chapa y pintura.'}
    ]
  }
};

/* ---------- estado y refs ---------- */
const M = 34;                 // px por metro (2D)
const OX = 48, OY = 24;       // origen del edificio en el SVG
const PAD_B = 78, PAD_R = 24; // márgenes para cotas/portones
let curPlan = '250';
let curView = '2d';
let animToken = 0;            // cancela animaciones al cambiar de planta
let hiddenCats = {};          // categorías ocultadas por la leyenda

const $ = s => document.querySelector(s);
const view2d = $('#view2d');
const tip = $('#tip');

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* ---------- envoltura de texto para etiquetas ---------- */
function wrapLabel(name, maxChars){
  const words = name.split(' ');
  const lines = []; let cur = '';
  for(const w of words){
    if((cur+' '+w).trim().length <= maxChars) cur = (cur+' '+w).trim();
    else { if(cur) lines.push(cur); cur = w; }
  }
  if(cur) lines.push(cur);
  return lines.slice(0,3);
}

/* ============================================================
   PLANO 2D
   ============================================================ */
function render2D(){
  const plan = PLANS[curPlan];
  const BW = plan.w*M, BH = plan.h*M;
  const vbW = OX + BW + PAD_R, vbH = OY + BH + PAD_B;
  const bx = OX, by = OY;
  let s = `<svg viewBox="0 0 ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg" id="planSvg">`;

  // suelo del edificio
  s += `<rect x="${bx}" y="${by}" width="${BW}" height="${BH}" fill="#111114" rx="4"/>`;
  // rejilla cada 1 m
  s += `<g stroke="#1b1b20" stroke-width="0.6">`;
  for(let m=1;m<plan.w;m++) s += `<line x1="${bx+m*M}" y1="${by}" x2="${bx+m*M}" y2="${by+BH}"/>`;
  for(let m=1;m<plan.h;m++) s += `<line x1="${bx}" y1="${by+m*M}" x2="${bx+BW}" y2="${by+m*M}"/>`;
  s += `</g>`;

  // zonas
  s += `<g class="plan" id="planG">`;
  plan.zones.forEach((z,i)=>{
    const c = CATS[z.cat];
    const zx = bx + z.x*M, zy = by + z.y*M, zw = z.w*M, zh = z.h*M;
    const cx = zx+zw/2, cy = zy+zh/2;
    const dash = c.dashed ? ` stroke-dasharray="5 4"` : '';
    s += `<g class="zone" data-id="${z.id}" data-i="${i}">`;
    s += `<g class="zbox"><rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" rx="3" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"${dash}/></g>`;
    // etiqueta
    s += `<g class="zlbl">`;
    const minSide = Math.min(zw,zh);
    let fs = Math.max(7.5, Math.min(12.5, minSide*0.30, zw/ (Math.max(6,name0(z.name))*0.34)));
    const maxChars = Math.max(5, Math.floor((zw-8)/(fs*0.52)));
    const lines = wrapLabel(z.name.toUpperCase(), maxChars);
    const noteH = z.note ? fs*0.92 : 0;
    const totalH = lines.length*(fs*1.12) + noteH;
    let ty = cy - totalH/2 + fs*0.9;
    lines.forEach(ln=>{
      s += `<text x="${cx}" y="${ty}" text-anchor="middle" font-family="'Hanken Grotesk',sans-serif" font-size="${fs.toFixed(1)}" font-weight="700" fill="#ece8df">${esc(ln)}</text>`;
      ty += fs*1.12;
    });
    if(z.note){
      s += `<text x="${cx}" y="${ty}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="${(fs*0.74).toFixed(1)}" fill="#9a958a">${esc(z.note)}</text>`;
    }
    s += `</g>`;
    // badge de elevador
    if(z.lift){
      const lx = zx + Math.min(15, zw*0.18), ly = zy + Math.min(15, zh*0.2);
      s += `<g class="lift"><circle cx="${lx}" cy="${ly}" r="9.5" fill="#cBA45e"/><text x="${lx}" y="${ly+3.6}" text-anchor="middle" font-family="'Hanken Grotesk'" font-size="11" font-weight="800" fill="#1a1408">${z.lift}</text></g>`;
    }
    s += `</g>`;
  });
  s += `</g>`;

  // muro perimetral (se traza)
  const peri = 2*(BW+BH);
  s += `<rect class="wallpath" x="${bx}" y="${by}" width="${BW}" height="${BH}" rx="4" fill="none" stroke="#6e5e38" stroke-width="5" pathLength="${peri}" stroke-dasharray="${peri}" stroke-dashoffset="${peri}"/>`;

  // portones en la fachada (abajo)
  plan.gates.forEach(g=>{
    const gx1 = bx + g.x*M, gx2 = bx + (g.x+g.w)*M, gy = by + BH, mid=(gx1+gx2)/2;
    s += `<g class="gate">`;
    s += `<line x1="${gx1}" y1="${gy}" x2="${gx2}" y2="${gy}" stroke="#22b8d6" stroke-width="4" stroke-dasharray="7 5"/>`;
    s += `<polygon points="${mid-6},${gy+14} ${mid+6},${gy+14} ${mid},${gy+4}" fill="#22b8d6"/>`;
    s += `<text x="${mid}" y="${gy+30}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="9.5" fill="#5fc7da">${esc(g.label)}</text>`;
    s += `</g>`;
  });

  // cota inferior (ancho)
  const dyw = by + BH + 50;
  s += `<g class="dimline">`;
  s += `<line x1="${bx}" y1="${dyw}" x2="${bx+BW}" y2="${dyw}" stroke="#615e57" stroke-width="1"/>`;
  s += `<line x1="${bx}" y1="${dyw-4}" x2="${bx}" y2="${dyw+4}" stroke="#615e57" stroke-width="1"/>`;
  s += `<line x1="${bx+BW}" y1="${dyw-4}" x2="${bx+BW}" y2="${dyw+4}" stroke="#615e57" stroke-width="1"/>`;
  s += `<rect x="${bx+BW/2-30}" y="${dyw-8}" width="60" height="16" fill="#0c0c0e"/>`;
  s += `<text x="${bx+BW/2}" y="${dyw+4}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600" fill="#d8be86">${plan.wLabel}</text>`;
  // cota izquierda (alto)
  const dxh = bx - 28;
  s += `<line x1="${dxh}" y1="${by}" x2="${dxh}" y2="${by+BH}" stroke="#615e57" stroke-width="1"/>`;
  s += `<line x1="${dxh-4}" y1="${by}" x2="${dxh+4}" y2="${by}" stroke="#615e57" stroke-width="1"/>`;
  s += `<line x1="${dxh-4}" y1="${by+BH}" x2="${dxh+4}" y2="${by+BH}" stroke="#615e57" stroke-width="1"/>`;
  s += `<text x="${dxh}" y="${by+BH/2}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="11" font-weight="600" fill="#d8be86" transform="rotate(-90 ${dxh} ${by+BH/2})"><tspan dy="-3">${plan.hLabel}</tspan></text>`;
  s += `</g>`;

  s += `</svg>`;
  view2d.innerHTML = s;

  $('#scaleFlag').textContent = plan.flag;
  buildLegend(); buildSurfaces(); applyHidden();
  bindZoneHover();
  animate2D();
}
function name0(n){return n.split(' ').reduce((a,b)=>Math.max(a,b.length),0);}

/* ---------- animación de entrada ---------- */
function animate2D(){
  const token = ++animToken;
  const svg = $('#planSvg'); if(!svg) return;
  const wall = svg.querySelector('.wallpath');
  const zones = [...svg.querySelectorAll('.zone')];
  const gates = [...svg.querySelectorAll('.gate')];
  const dim = svg.querySelector('.dimline');
  // reflow
  void svg.getBoundingClientRect();
  requestAnimationFrame(()=>{
    if(token!==animToken) return;
    if(wall) wall.style.strokeDashoffset = '0';
    zones.forEach((z,i)=>{
      setTimeout(()=>{
        if(token!==animToken) return;
        z.classList.add('in');
        const lift = z.querySelector('.lift'); if(lift) lift.classList.add('in');
      }, 380 + i*120);
    });
    const after = 380 + zones.length*120 + 120;
    setTimeout(()=>{ if(token!==animToken) return; gates.forEach(g=>g.classList.add('in')); if(dim) dim.classList.add('in'); }, after);
  });
}

/* ---------- leyenda y superficies ---------- */
function buildLegend(){
  const used = [...new Set(PLANS[curPlan].zones.map(z=>z.cat))];
  const order = ['mecanica','chapa','pintura','lavado','oficina','instalaciones','aseos','circulacion'];
  const cats = order.filter(c=>used.includes(c));
  $('#legend').innerHTML = cats.map(c=>{
    const m = CATS[c];
    const n = PLANS[curPlan].zones.filter(z=>z.cat===c).length;
    return `<div class="legrow${hiddenCats[c]?' off':''}" data-cat="${c}">
      <span class="swatch" style="background:${m.fill};border-color:${m.stroke}"></span>
      <span class="lt">${m.label}</span><span class="lc">${n}</span></div>`;
  }).join('');
  $('#legend').querySelectorAll('.legrow').forEach(r=>{
    r.onclick = ()=>{ const c=r.dataset.cat; hiddenCats[c]=!hiddenCats[c]; r.classList.toggle('off'); applyHidden(); if(view3d.active) build3D(); };
  });
}
function buildSurfaces(){
  $('#surfaces').innerHTML = PLANS[curPlan].surfaces.map((r,i,a)=>{
    const tot = i===a.length-1;
    return `<div class="surf${tot?' tot':''}"><span>${esc(r[0])}</span><span class="sv">${esc(r[1])}</span></div>`;
  }).join('');
}
function applyHidden(){
  const svg = $('#planSvg'); if(!svg) return;
  svg.querySelectorAll('.zone').forEach(z=>{
    const zd = PLANS[curPlan].zones.find(x=>x.id===z.dataset.id);
    z.style.display = (zd && hiddenCats[zd.cat]) ? 'none' : '';
  });
}

/* ---------- hover / tooltip ---------- */
function bindZoneHover(){
  const svg = $('#planSvg'); if(!svg) return;
  svg.querySelectorAll('.zone').forEach(g=>{
    const z = PLANS[curPlan].zones.find(x=>x.id===g.dataset.id);
    g.addEventListener('mousemove', e=>{
      tip.innerHTML = `<div class="tt">${esc(z.name)}</div>`+
        `<div>${CATS[z.cat].label}</div>`+
        `<div class="tm">${z.w.toLocaleString('es')}×${z.h.toLocaleString('es')} m · ${Math.round(z.w*z.h)} m²${z.lift?' · elevador '+z.lift:''}</div>`;
      tip.style.left = Math.min(e.clientX+14, innerWidth-240)+'px';
      tip.style.top = (e.clientY+14)+'px';
      tip.style.opacity = '1';
    });
    g.addEventListener('mouseleave', ()=>{ tip.style.opacity='0'; });
    g.addEventListener('click', ()=>{ startTour(+g.dataset.i); });
  });
}

/* ============================================================
   RECORRIDO GUIADO
   ============================================================ */
let tour = {active:false, i:0, playing:false, timer:null, vbAnim:null};
const tourCap=$('#tourCap'), tourBar=$('#tourBar');

function fullVB(){ const p=PLANS[curPlan]; return {x:0,y:0,w:OX+p.w*M+PAD_R,h:OY+p.h*M+PAD_B}; }

function startTour(startIndex){
  if(curView!=='2d') setView('2d');
  const svg=$('#planSvg'); if(!svg) return;
  tour.active=true; tour.playing=true;
  tour.i = (typeof startIndex==='number' && startIndex>=0)? startIndex : 0;
  $('#planG').classList.add('dim');
  tourCap.classList.add('show'); tourBar.classList.add('show');
  $('#tourBtn').textContent='● En recorrido';
  showStep();
}
function visibleZones(){ return PLANS[curPlan].zones.map((z,i)=>({z,i})).filter(o=>!hiddenCats[o.z.cat]); }

function showStep(){
  const svg=$('#planSvg'); if(!svg){return;}
  const zones=PLANS[curPlan].zones;
  // saltar zonas ocultas
  let guard=0;
  while(hiddenCats[zones[tour.i].cat] && guard<zones.length){ tour.i=(tour.i+1)%zones.length; guard++; }
  const z=zones[tour.i];
  svg.querySelectorAll('.zone').forEach(g=>g.classList.toggle('hot', g.dataset.id===z.id));
  const c=CATS[z.cat];
  $('#tcCat').textContent=c.label; $('#tcCat').style.color=c.stroke;
  tourCap.style.borderLeftColor=c.stroke;
  $('#tcName').textContent=z.name;
  $('#tcDesc').textContent=z.desc||'';
  $('#tcMeta').textContent=`${z.w.toLocaleString('es')}×${z.h.toLocaleString('es')} m · ${Math.round(z.w*z.h)} m²`+(z.lift?` · elevador ${z.lift}`:'');
  $('#tStep').textContent=`${tour.i+1} / ${zones.length}`;
  // zoom suave a la zona
  const p=PLANS[curPlan], pad=58;
  const tx=OX+z.x*M-pad, ty=OY+z.y*M-pad, tw=z.w*M+pad*2, th=z.h*M+pad*2;
  tweenVB({x:tx,y:ty,w:tw,h:th});
  clearTimeout(tour.timer);
  if(tour.playing) tour.timer=setTimeout(()=>{ tour.i=(tour.i+1)%zones.length; showStep(); }, 3000);
}
function tweenVB(target){
  const svg=$('#planSvg'); if(!svg) return;
  if(tour.vbAnim) cancelAnimationFrame(tour.vbAnim);
  const cur=(svg.getAttribute('viewBox')||`0 0 ${fullVB().w} ${fullVB().h}`).split(' ').map(Number);
  const from={x:cur[0],y:cur[1],w:cur[2],h:cur[3]};
  const t0=performance.now(), dur=620;
  const ease=t=>1-Math.pow(1-t,3);
  function frame(now){
    const k=Math.min(1,(now-t0)/dur), e=ease(k);
    const x=from.x+(target.x-from.x)*e, y=from.y+(target.y-from.y)*e,
          w=from.w+(target.w-from.w)*e, h=from.h+(target.h-from.h)*e;
    svg.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);
    if(k<1) tour.vbAnim=requestAnimationFrame(frame);
  }
  tour.vbAnim=requestAnimationFrame(frame);
}
function exitTour(){
  tour.active=false; tour.playing=false; clearTimeout(tour.timer);
  const svg=$('#planSvg');
  if(svg){ $('#planG').classList.remove('dim'); svg.querySelectorAll('.zone').forEach(g=>g.classList.remove('hot')); tweenVB(fullVB()); }
  tourCap.classList.remove('show'); tourBar.classList.remove('show');
  $('#tourBtn').textContent='▶ Recorrido guiado';
}
function tourNext(d){ const n=PLANS[curPlan].zones.length; tour.i=(tour.i+d+n)%n; tour.playing=false; $('#tPause').textContent='▶'; showStep(); }

/* ============================================================
   VISTA 3D  (Three.js r128)
   ============================================================ */
const view3d = {active:false, raf:null, renderer:null, scene:null, camera:null, el:$('#view3d'),
  theta:-0.9, phi:1.02, radius:30, autorot:true, drag:false, lx:0, ly:0, onResize:null};

function build3D(){
  const host=view3d.el;
  destroy3D();
  if(!window.THREE){
    host.innerHTML='<div class="threefail">La vista 3D necesita conexión para cargar el motor de render. Vuelve a intentarlo con internet — el plano 2D funciona sin conexión.</div>';
    return;
  }
  const plan=PLANS[curPlan];
  const W=host.clientWidth||900, H=560;
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#0c0c0e');
  const camera=new THREE.PerspectiveCamera(45, W/H, 0.1, 500);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(W,H);
  host.innerHTML=''; host.appendChild(renderer.domElement);
  host.insertAdjacentHTML('beforeend','<div class="threehint">Arrastra para girar · rueda para acercar</div>');

  // luces
  scene.add(new THREE.AmbientLight(0xffffff,0.62));
  const dir=new THREE.DirectionalLight(0xfff0d8,0.95); dir.position.set(14,26,10); scene.add(dir);
  const dir2=new THREE.DirectionalLight(0x88aaff,0.28); dir2.position.set(-16,12,-12); scene.add(dir2);

  const grp=new THREE.Group();
  const cxm=plan.w/2, czm=plan.h/2;       // centro para recentrar
  // suelo
  const floor=new THREE.Mesh(new THREE.BoxGeometry(plan.w,0.12,plan.h),
    new THREE.MeshStandardMaterial({color:0x17171b,roughness:0.95}));
  floor.position.set(0,-0.06,0); grp.add(floor);
  // borde dorado del suelo
  const fedge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(plan.w,0.12,plan.h)),
    new THREE.LineBasicMaterial({color:0x6e5e38})); fedge.position.copy(floor.position); grp.add(fedge);

  // zonas
  plan.zones.forEach(z=>{
    if(hiddenCats[z.cat]) return;
    const c=CATS[z.cat];
    const isCirc=z.cat==='circulacion';
    const hgt=isCirc?0.06:z.h3d;
    const geo=new THREE.BoxGeometry(z.w*0.96, hgt, z.h*0.96);
    const mat=new THREE.MeshStandardMaterial({color:new THREE.Color(c.solid), roughness:0.7, metalness:0.05,
      transparent:true, opacity:isCirc?0.25:0.9});
    const mesh=new THREE.Mesh(geo,mat);
    const px=(z.x+z.w/2)-cxm, pz=(z.y+z.h/2)-czm;
    mesh.position.set(px, hgt/2, pz); grp.add(mesh);
    if(!isCirc){
      const ed=new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({color:new THREE.Color(c.stroke)}));
      ed.position.copy(mesh.position); grp.add(ed);
    }
    // marcador de elevador: poste dorado
    if(z.lift){
      const post=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,hgt+0.7,12),
        new THREE.MeshStandardMaterial({color:0xcBA45e,metalness:0.4,roughness:0.4}));
      post.position.set(px, (hgt+0.7)/2, pz); grp.add(post);
    }
  });

  // muros perimetrales (bajos, translúcidos)
  const wallMat=new THREE.MeshStandardMaterial({color:0x2a2a30,roughness:1,transparent:true,opacity:0.55});
  const wh=0.9, t=0.16;
  const mkWall=(w,d,x,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,wh,d),wallMat);m.position.set(x,wh/2,z);grp.add(m);};
  mkWall(plan.w,t,0,-czm); mkWall(plan.w,t,0,czm); mkWall(t,plan.h,-cxm,0); mkWall(t,plan.h,cxm,0);

  scene.add(grp);
  view3d.scene=scene; view3d.camera=camera; view3d.renderer=renderer;
  view3d.radius=Math.max(plan.w,plan.h)*1.15; view3d.theta=-0.9; view3d.phi=1.02; view3d.autorot=true;

  // interacción
  const dom=renderer.domElement;
  const down=e=>{view3d.drag=true;host.classList.add('dragging');view3d.autorot=false;const p=e.touches?e.touches[0]:e;view3d.lx=p.clientX;view3d.ly=p.clientY;};
  const move=e=>{if(!view3d.drag)return;const p=e.touches?e.touches[0]:e;const dx=p.clientX-view3d.lx,dy=p.clientY-view3d.ly;view3d.lx=p.clientX;view3d.ly=p.clientY;view3d.theta-=dx*0.008;view3d.phi=Math.max(0.25,Math.min(1.45,view3d.phi-dy*0.006));};
  const up=()=>{view3d.drag=false;host.classList.remove('dragging');};
  const wheel=e=>{e.preventDefault();view3d.radius=Math.max(plan.w*0.5,Math.min(plan.w*2.4,view3d.radius+ (e.deltaY>0?1:-1)*Math.max(plan.w,plan.h)*0.05));};
  dom.addEventListener('mousedown',down); window.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
  dom.addEventListener('touchstart',down,{passive:true}); dom.addEventListener('touchmove',move,{passive:true}); dom.addEventListener('touchend',up);
  dom.addEventListener('wheel',wheel,{passive:false});
  view3d._cleanup=()=>{window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',up);};

  view3d.onResize=()=>{const w=host.clientWidth||900;renderer.setSize(w,H);camera.aspect=w/H;camera.updateProjectionMatrix();};
  window.addEventListener('resize',view3d.onResize);

  (function loop(){
    view3d.raf=requestAnimationFrame(loop);
    if(view3d.autorot) view3d.theta+=0.0022;
    const r=view3d.radius, ph=view3d.phi, th=view3d.theta;
    camera.position.set(Math.sin(ph)*Math.cos(th)*r, Math.cos(ph)*r, Math.sin(ph)*Math.sin(th)*r);
    camera.lookAt(0,1.2,0);
    renderer.render(scene,camera);
  })();
}
function destroy3D(){
  if(view3d.raf) cancelAnimationFrame(view3d.raf); view3d.raf=null;
  if(view3d.onResize){ window.removeEventListener('resize',view3d.onResize); view3d.onResize=null; }
  if(view3d._cleanup){ view3d._cleanup(); view3d._cleanup=null; }
  if(view3d.renderer){ view3d.renderer.dispose(); }
  view3d.el.innerHTML=''; view3d.renderer=null; view3d.scene=null; view3d.camera=null;
}

/* ============================================================
   CAMBIO DE VISTA / PLANTA
   ============================================================ */
function setView(v){
  curView=v;
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('on',b.dataset.view===v));
  if(v==='3d'){
    if(tour.active) exitTour();
    view2d.style.display='none'; view3d.el.style.display='block'; view3d.active=true;
    build3D();
  }else{
    view3d.active=false; destroy3D();
    view3d.el.style.display='none'; view2d.style.display='block';
  }
}
function setPlan(p){
  if(curPlan===p) return;
  curPlan=p; if(tour.active) exitTour();
  document.querySelectorAll('[data-plan]').forEach(b=>b.classList.toggle('on',b.dataset.plan===p));
  render2D();
  if(curView==='3d') build3D();
}

/* ---------- wiring ---------- */
document.querySelectorAll('[data-plan]').forEach(b=>b.onclick=()=>setPlan(b.dataset.plan));
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#tourBtn').onclick=()=>{ tour.active?exitTour():startTour(0); };
$('#replayBtn').onclick=()=>{ if(tour.active) exitTour(); if(curView==='2d') render2D(); else build3D(); };
$('#tPrev').onclick=()=>tourNext(-1);
$('#tNext').onclick=()=>tourNext(1);
$('#tExit').onclick=exitTour;
$('#tPause').onclick=()=>{ tour.playing=!tour.playing; $('#tPause').textContent=tour.playing?'❚❚':'▶'; if(tour.playing) showStep(); else clearTimeout(tour.timer); };

render2D();
