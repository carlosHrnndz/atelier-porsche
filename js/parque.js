/* ============================================================
   Manufaktur Porsche · Observatorio del Parque (DGT 2026-03)
   ============================================================ */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fmt=n=>n.toLocaleString('es-ES');

/* ---------- TALLERES (censo verificado · web añade dirección localizable) ----------
   tipo: 'of' oficial · 'es' especialista independiente · 'bt' boutique compraventa
   campos: n nombre · c [lat,lon] · d descripción · w web (opcional) */
const TALLERES=[
 // — Centros oficiales Porsche —
 {t:'of',n:'Centro Porsche Madrid Norte',c:[40.494,-3.662],d:'A-1 Vía de Servicio 87, Madrid. Ventas y posventa oficial.',w:'porsche-madridnorte.com'},
 {t:'of',n:'Centro Porsche Madrid Oeste',c:[40.469,-3.876],d:'Pol. El Carralero, Majadahonda. Oficial.',w:'porsche-madridoeste.com'},
 {t:'of',n:'Centro Porsche Barcelona',c:[41.354,2.121],d:'C/ Botánica 89, L\'Hospitalet · 9.000 m².',w:'porsche-barcelona.com'},
 {t:'of',n:'Centro Porsche Sant Cugat',c:[41.472,2.077],d:'Prat de la Riba 20, Sant Cugat del Vallès.',w:'porsche-santcugat.com'},
 {t:'of',n:'Centro Porsche Girona',c:[41.962,2.792],d:'Girona. Oficial.'},
 {t:'of',n:'Centro Porsche Lleida',c:[41.621,0.639],d:'Lleida. Oficial.'},
 {t:'of',n:'Centro Porsche Tarragona',c:[41.129,1.243],d:'Tarragona. Oficial.'},
 {t:'of',n:'Centro Porsche Valencia',c:[39.474,-0.452],d:'Av. Comarques 4-6, Quart de Poblet. Premiado mejor concesionario España-Portugal.',w:'porsche-valencia.com'},
 {t:'of',n:'Centro Porsche Alicante',c:[38.336,-0.518],d:'C/ Río Júcar 1, Alicante.'},
 {t:'of',n:'Centro Porsche Málaga',c:[36.713,-4.463],d:'Málaga. Oficial.'},
 {t:'of',n:'Centro Porsche Marbella',c:[36.488,-4.952],d:'Ctra. Cádiz km 175, Puerto Banús.'},
 {t:'of',n:'Centro Porsche Sevilla',c:[37.422,-5.932],d:'Av. Ruta de la Plata 3, Sevilla.',w:'porsche-sevilla.com'},
 {t:'of',n:'Centro Porsche Zaragoza',c:[41.641,-0.931],d:'C/ Langa del Castillo 8, Zaragoza.',w:'porsche-zaragoza.com'},
 {t:'of',n:'Centro Porsche Murcia',c:[38.024,-1.163],d:'Ctra. Madrid km 384, El Espinardo.',w:'porsche-murcia.com'},
 {t:'of',n:'Centro Porsche Pamplona',c:[42.762,-1.636],d:'Pol. Talluntxe, Noain, Navarra.',w:'porsche-pamplona.com'},
 {t:'of',n:'Centro Porsche Bilbao',c:[43.231,-2.834],d:'Galdakao, Bizkaia.'},
 {t:'of',n:'Centro Porsche A Coruña',c:[43.333,-8.323],d:'Av. das Mariñas 286, Oleiros.'},
 {t:'of',n:'Centro Porsche Vigo',c:[42.222,-8.694],d:'Ctra. Madrid 152, Vigo.'},
 {t:'of',n:'Centro Porsche Asturias',c:[43.414,-5.804],d:'Pol. Los Peñones, Lugones.'},
 {t:'of',n:'Centro Porsche Valladolid',c:[41.672,-4.741],d:'Av. Burgos 74, Valladolid.'},
 {t:'of',n:'Centro Porsche Baleares',c:[39.601,2.660],d:'Son Castelló, Palma de Mallorca.'},
 {t:'of',n:'Centro Porsche Las Palmas',c:[28.108,-15.437],d:'Las Palmas de Gran Canaria.'},
 {t:'of',n:'Centro Porsche Tenerife',c:[28.461,-16.262],d:'S/C de Tenerife.'},
 // — Especialistas independientes —
 {t:'es',n:'Valentín Motors Madrid',c:[40.336,-3.776],d:'Puig Adam 10, Leganés · especialista desde 1979 · 2.500 m² · TECHART · clásicos y modernos.',w:'valentinmotors.es'},
 {t:'es',n:'Valentín Motors Barcelona',c:[41.373,2.135],d:'Ronda del Mig · 1.320 m² · plancha y pintura · clásicos y youngtimers.',w:'valentinmotors.es'},
 {t:'es',n:'TaredBlau',c:[40.322,-3.875],d:'C/ Plasencia 47 (M-506), Móstoles · 1.000 m² · taller + compraventa + importación.',w:'taredblau.com'},
 {t:'es',n:'IBR Porsatek',c:[40.482,-3.354],d:'Pol. San Miguel, Alcalá de Henares · especialista independiente, Iván · muy valorado en 911.',w:'ibrporsatek.com'},
 {t:'es',n:'Carrera 6',c:[40.541,-3.642],d:'Alcobendas · mecánica Porsche desde 2004 · diagnosis y motor.',w:'carrera6.com'},
 {t:'es',n:'Porsche911Madrid',c:[40.555,-3.323],d:'C/ Ferrocarril 16, Meco · taller + chapa/pintura + neumáticos · 4,6★ (63 reseñas).',w:'porsche911madrid.com'},
 {t:'es',n:'Baltasar e Hijos',c:[40.597,-3.499],d:'C/ Río Ter 12, Algete · mecánica · 4,9★ (35 reseñas).'},
 {t:'es',n:'Targa Klassik',c:[40.438,-3.625],d:'C/ Miguel Yuste 13, Madrid · especialista en Porsche clásicos deportivos.',w:'targaklassik.com'},
 {t:'es',n:'GT Stradale',c:[40.371,-3.642],d:'Cno. Hormigueras 178, Madrid · alta gama, +40 años · piezas genuinas.',w:'gtstradale.com'},
 {t:'es',n:'Grupo Motorsport (Moncloa)',c:[40.435,-3.718],d:'Plaza Manuel Becerra / Moncloa · independiente · PIWIS y Autologic.',w:'galileo-motorsport.com'},
 {t:'es',n:'Grupo Motorsport (Alcobendas)',c:[40.541,-3.641],d:'Alcobendas · independiente · alternativa al oficial.',w:'galileo-motorsport.com'},
 {t:'es',n:'Sauri Classics',c:[42.846,-2.673],d:'Vitoria-Gasteiz · Porsche clásicos y modernos · restauración · +20 años.',w:'sauriclassics.com'},
 // — Boutiques / compraventa especializada —
 {t:'bt',n:'TaredBlau · Compraventa',c:[40.323,-3.873],d:'Móstoles · compraventa integrada con taller: revisión previa intensa, historial transparente, importación a demanda.',w:'taredblau.com'},
 {t:'bt',n:'MYG Porsche',c:[40.430,-3.700],d:'Madrid · Independent Specialist · Porsche de segunda mano seleccionados y revisados · +20 años.',w:'mygporsche.com'}
];

/* ---------- ZONAS CANDIDATAS (multifactor: parque · competencia · facturación · visibilidad) ----------
   parque = nº Porsches zona (registro) · comp = competidores especialistas cercanos
   factEst = facturación potencial anual orientativa (€) · vis = visibilidad boutique (1-5)
   score = índice 0-100 calculado */
const ZONAS=[
 // ===== MADRID (5) =====
 {reg:'Madrid',n:'Arco Noroeste · A-6/M-50',c:[40.46,-3.86],r:8500,parque:3429,comp:1,factEst:780000,vis:4,score:94,
  p:'Pozuelo, Boadilla, Majadahonda, Las Rozas y Villanueva: 3.429 Porsches, la mayor densidad y renta de España. Competencia independiente casi nula (solo TaredBlau al sur, en Móstoles). El oficial Madrid Oeste no compite en precio. Visibilidad alta en ejes M-50/A-6. Mejor combinación parque×hueco del país.'},
 {reg:'Madrid',n:'Corredor Norte · A-1',c:[40.54,-3.64],r:6500,parque:2026,comp:3,factEst:520000,vis:3,score:74,
  p:'Alcobendas + S.S. de los Reyes + La Moraleja: 2.026 Porsches y altísimo poder adquisitivo. Pero ya operan el Centro Porsche Madrid Norte y dos independientes (Carrera 6, Grupo Motorsport). Entrar exige diferenciación fuerte: el diagnóstico a domicilio y la boutique serían la cuña.'},
 {reg:'Madrid',n:'Eje Sur · A-42 (Leganés-Getafe)',c:[40.34,-3.76],r:7000,parque:772,comp:1,factEst:300000,vis:2,score:55,
  p:'772 Porsches y suelo industrial barato (clave para CAPEX y restauración). Pero Valentín Motors domina la zona desde 1979: competir de frente con el referente histórico es duro. Viable solo con nicho muy claro (p. ej. restomod/3D).'},
 {reg:'Madrid',n:'Corredor del Henares · A-2',c:[40.50,-3.40],r:9000,parque:350,comp:3,factEst:160000,vis:2,score:38,
  p:'Alcalá-Meco-Torrejón: parque modesto (350) y ya saturado de especialistas (IBR Porsatek, Porsche911Madrid, Baltasar e Hijos). Suelo barato pero poca renta y mucha competencia. Baja prioridad.'},
 {reg:'Madrid',n:'Capital · distritos premium',c:[40.44,-3.69],r:4000,parque:7954,comp:4,factEst:900000,vis:5,score:70,
  p:'7.954 Porsches en la capital y visibilidad de boutique inmejorable (Salamanca, Chamartín). Contras: alquileres prohibitivos, sin sitio para elevadores ni pintura, y varios especialistas ya dentro (Targa, GT Stradale, Grupo Motorsport). Modelo showroom + taller satélite, no taller puro.'},
 // ===== RESTO DE ESPAÑA (10) =====
 {reg:'España',n:'Marbella · Costa del Sol',c:[36.51,-4.885],r:12000,parque:1913,comp:1,factEst:680000,vis:5,score:88,
  p:'TERCER municipio de España por parque (1.913), por delante de Valencia. Cliente internacional de altísimo gasto, estacionalidad inversa a Madrid, y solo el oficial de Puerto Banús como referencia. Visibilidad de lujo. La gran oportunidad fuera de Madrid.'},
 {reg:'España',n:'Barcelona · área metropolitana',c:[41.38,2.13],r:10000,parque:10404,comp:3,factEst:850000,vis:4,score:72,
  p:'10.404 Porsches en la provincia, segundo mercado nacional. Pero competencia consolidada: Valentín BCN, FLAT 6, oficiales. Mercado enorme que admite más actores, sobre todo con propuesta boutique/restomod diferenciada.'},
 {reg:'España',n:'Valencia · Quart-Paterna',c:[39.47,-0.45],r:9000,parque:3789,comp:1,factEst:430000,vis:3,score:78,
  p:'3.789 en provincia, 1.468 en la capital. Solo el oficial (premiado) como referencia y casi nula competencia independiente. Suelo industrial asequible al oeste. Hueco claro de especialista independiente.'},
 {reg:'España',n:'Palma de Mallorca',c:[39.60,2.66],r:11000,parque:3693,comp:1,factEst:520000,vis:4,score:80,
  p:'3.693 Porsches en Baleares (1.182 en Palma, 572 en Calvià). Cliente premium internacional y estacional. Solo el oficial. Insularidad encarece piezas pero blinda el mercado local frente a competidores peninsulares.'},
 {reg:'España',n:'Alicante · Costa Blanca',c:[38.34,-0.49],r:11000,parque:3870,comp:1,factEst:410000,vis:3,score:74,
  p:'3.870 en provincia con fuerte colonia internacional (residentes europeos). Solo el oficial. Estacionalidad turística y crecimiento del parque. Hueco de especialista evidente.'},
 {reg:'España',n:'Málaga capital',c:[36.72,-4.45],r:8000,parque:5322,comp:1,factEst:470000,vis:3,score:76,
  p:'La provincia (5.322) es la 2ª de Andalucía y top nacional. Más allá de Marbella, la capital tiene 771 y solo el oficial. Mercado en alza por el efecto "Costa del Sol tech".'},
 {reg:'España',n:'Bilbao · Margen derecha',c:[43.26,-2.94],r:8000,parque:1376,comp:2,factEst:320000,vis:3,score:62,
  p:'1.376 en Bizkaia, renta alta y cultura de coche cuidado. Existe oficial (Galdakao) y algún especialista cercano (Sauri en Vitoria). Mercado sólido pero más pequeño; fidelidad alta una vez dentro.'},
 {reg:'España',n:'Sevilla',c:[37.39,-5.98],r:9000,parque:1541,comp:1,factEst:300000,vis:3,score:60,
  p:'1.541 en provincia, capital andaluza. Solo el oficial. Mercado mediano con poca competencia independiente; verano muy caluroso (estacionalidad de uso). Entrada cómoda sin guerra de precios.'},
 {reg:'España',n:'Zaragoza',c:[41.65,-0.89],r:8000,parque:1221,comp:1,factEst:260000,vis:2,score:55,
  p:'1.221 en provincia, nudo logístico entre Madrid-Barcelona-Bilbao. Solo el oficial. Parque medio pero suelo barato y posición central para captar de tres mercados. Visibilidad limitada.'},
 {reg:'España',n:'Vigo · Pontevedra',c:[42.23,-8.71],r:9000,parque:1653,comp:1,factEst:280000,vis:2,score:57,
  p:'1.653 en Pontevedra (638 en Vigo). Galicia tiene parque repartido y solo oficiales (Vigo, A Coruña). Mercado fiel y aislado de competencia peninsular, aunque de menor poder adquisitivo medio.'},
 {reg:'España',n:'Girona · Costa Brava',c:[41.98,2.82],r:10000,parque:1789,comp:1,factEst:330000,vis:3,score:63,
  p:'1.789 en provincia, con fuerte segunda residencia europea (franceses, suizos) y proximidad a Barcelona. Solo el oficial. Estacionalidad alta pero cliente de gasto elevado en verano.'}
];

/* ---------- estado ---------- */
let D=null, GEO=null, MAP=null;
let provLayer=null, muniLayer=null, ofLayer=null, esLayer=null, btLayer=null, znLayer=null;
const IS_TOUCH=window.matchMedia('(hover:none)').matches||'ontouchstart'in window;
let SHOW_TEXT=true;
const F={fams:new Set(), gen:-1, fuel:-1, dist:-1, yMin:1950, yMax:2026, cMin:0, cMax:800, gar:false, clas:false, jur:false, rent:false};

/* ---------- carga ---------- */
Promise.all([
  fetch('data/parque_data.json').then(r=>{if(!r.ok)throw 0;return r.json()}),
  fetch('data/provincias.geojson').then(r=>{if(!r.ok)throw 0;return r.json()})
]).then(([d,g])=>{D=d;GEO=g;init();})
 .catch(()=>{$('#loaderr').style.display='block';$('.spinner').style.display='none';$('.loading .lt').textContent='';});

/* ---------- agregación pura ---------- */
function applyFilters(){
  const rows=D.rows, useF=F.fams.size>0;
  const provC={}, muniC=new Map();
  let total=0, gar=0, clas=0;
  for(let i=0;i<rows.length;i++){
    const r=rows[i];
    if(useF && !F.fams.has(r[2])) continue;
    if(F.gen>=0 && r[3]!==F.gen) continue;
    if(F.fuel>=0 && r[5]!==F.fuel) continue;
    if(F.dist>=0 && r[6]!==F.dist) continue;
    const y=r[4]; if(y && (y<F.yMin||y>F.yMax)) continue; if(!y && F.yMin>1950) continue;
    const cv=r[7]; if(cv && (cv<F.cMin||(F.cMax<800&&cv>F.cMax))) continue; if(!cv && F.cMin>0) continue;
    if(F.gar && !r[8]) continue;
    if(F.clas && !r[9]) continue;
    if(F.jur && !r[10]) continue;
    if(F.rent && !r[11]) continue;
    total++; gar+=r[8]; clas+=r[9];
    provC[r[0]]=(provC[r[0]]||0)+1;
    if(r[1]>=0) muniC.set(r[1],(muniC.get(r[1])||0)+1);
  }
  return {total,gar,clas,provC,muniC};
}

/* ---------- init ---------- */
function init(){
  // mapa
  MAP=L.map('map',{zoomControl:false,attributionControl:true,scrollWheelZoom:true,minZoom:5})
       .setView([40.0,-3.7],6);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {attribution:'© OpenStreetMap · © CARTO',subdomains:'abcd',maxZoom:18}).addTo(MAP);
  L.control.zoom({position:'bottomright'}).addTo(MAP);

  // detector de nivel de zoom para ocultar/mostrar nombres de talleres
  const updateZoomNames = () => {
    const zoom = MAP.getZoom();
    document.body.classList.toggle('hide-taller-names', zoom < 10);
  };
  MAP.on('zoomend', updateZoomNames);
  updateZoomNames();

  // chips de familia (ordenadas por volumen)
  const famCount={}; D.rows.forEach(r=>famCount[r[2]]=(famCount[r[2]]||0)+1);
  const order=[...D.fams.keys()].sort((a,b)=>(famCount[b]||0)-(famCount[a]||0));
  const chipsBox=$('#famChips');
  const allChip=document.createElement('div');allChip.className='chip on';allChip.textContent='Todas';
  allChip.onclick=()=>{F.fams.clear();syncChips();update();};
  chipsBox.appendChild(allChip);
  order.forEach(fi=>{
    const c=document.createElement('div');c.className='chip';c.dataset.fi=fi;
    c.textContent=D.fams[fi];
    c.onclick=()=>{F.fams.has(fi)?F.fams.delete(fi):F.fams.add(fi);syncChips();syncGens();update();};
    chipsBox.appendChild(c);
  });
  function syncChips(){
    $$('#famChips .chip').forEach(c=>{
      if(!c.dataset.fi){c.classList.toggle('on',F.fams.size===0);return;}
      c.classList.toggle('on',F.fams.has(+c.dataset.fi));
    });
  }
  // generaciones (dependen de familia)
  const genOfFam={}; D.rows.forEach(r=>{(genOfFam[r[2]]=genOfFam[r[2]]||new Set()).add(r[3]);});
  function syncGens(){
    const sel=$('#genSel');const prev=+sel.value;sel.innerHTML='<option value="-1">Todas</option>';
    let gens=new Set();
    if(F.fams.size===0) D.gens.forEach((_,i)=>gens.add(i));
    else F.fams.forEach(fi=>(genOfFam[fi]||new Set()).forEach(g=>gens.add(g)));
    [...gens].sort((a,b)=>D.gens[a].localeCompare(D.gens[b])).forEach(gi=>{
      const o=document.createElement('option');o.value=gi;o.textContent=D.gens[gi];sel.appendChild(o);});
    sel.value=gens.has(prev)?prev:-1; F.gen=+sel.value;
  }
  syncGens();
  // selects simples
  D.fuels.forEach((f,i)=>{const o=document.createElement('option');o.value=i;o.textContent=f;$('#fuelSel').appendChild(o);});
  D.dists.forEach((f,i)=>{const o=document.createElement('option');o.value=i;o.textContent=f;$('#distSel').appendChild(o);});
  $('#genSel').onchange=e=>{F.gen=+e.target.value;update();};
  $('#fuelSel').onchange=e=>{F.fuel=+e.target.value;update();};
  $('#distSel').onchange=e=>{F.dist=+e.target.value;update();};
  // rangos
  const rg=(idMin,idMax,lMin,lMax,kMin,kMax,suf)=>{
    const a=$(idMin),b=$(idMax);
    const f=()=>{let v1=+a.value,v2=+b.value;if(v1>v2)[v1,v2]=[v2,v1];
      F[kMin]=v1;F[kMax]=v2;$(lMin).textContent=v1;$(lMax).textContent=v2+(suf&&v2>=+b.max?suf:'');update();};
    a.oninput=f;b.oninput=f;};
  rg('#yMin','#yMax','#yMinL','#yMaxL','yMin','yMax','');
  rg('#cMin','#cMax','#cMinL','#cMaxL','cMin','cMax','+');
  // toggles
  [['#fGar','gar'],['#fClas','clas'],['#fJur','jur'],['#fRent','rent']].forEach(([id,k])=>{
    $(id).onchange=e=>{F[k]=e.target.checked;update();};});
  $('#resetBtn').onclick=()=>{
    F.fams.clear();F.gen=-1;F.fuel=-1;F.dist=-1;F.yMin=1950;F.yMax=2026;F.cMin=0;F.cMax=800;
    F.gar=F.clas=F.jur=F.rent=false;
    $('#yMin').value=1950;$('#yMax').value=2026;$('#cMin').value=0;$('#cMax').value=800;
    $('#yMinL').textContent=1950;$('#yMaxL').textContent=2026;$('#cMinL').textContent=0;$('#cMaxL').textContent='800+';
    $('#genSel').value=-1;$('#fuelSel').value=-1;$('#distSel').value=-1;
    $$('.filters input[type=checkbox]').forEach(c=>c.checked=false);
    syncChips();syncGens();update();
  };

  // capas talleres — todos en rojo pálido, nombre visible por defecto, rollover/click para detalle
  ofLayer=L.layerGroup();esLayer=L.layerGroup();btLayer=L.layerGroup();
  const tallerIcon=(t)=>{
    const sym=t.t==='of'?'P':t.t==='es'?'★':'◆';
    return L.divIcon({className:'',iconSize:[150,40],iconAnchor:[13,13],
      html:`<div class="tk tk-${t.t}"><span class="tk-dot">${sym}</span><span class="tk-name">${t.n}</span></div>`});
  };
  const webLink=(w)=>w?`<a class="pop-w" href="https://${w}" target="_blank" rel="noopener">${w} ↗</a>`:'';
  TALLERES.forEach(t=>{
    const cat=t.t==='of'?'Centro oficial Porsche':t.t==='es'?'Especialista independiente':'Boutique · compraventa';
    const m=L.marker(t.c,{icon:tallerIcon(t)});
    const popup=`<div class="pop-t">${t.n}</div><div class="pop-n">${cat}</div><div class="pop-d">${t.d}</div>${webLink(t.w)}`;
    m.bindPopup(popup);
    // click/tap en todos (quitar rollover)
    m.on('click',function(){this.openPopup();});
    (t.t==='of'?ofLayer:t.t==='es'?esLayer:btLayer).addLayer(m);
  });
  ofLayer.addTo(MAP);esLayer.addTo(MAP);btLayer.addTo(MAP);

  // zonas candidatas (ordenadas por score)
  znLayer=L.layerGroup();
  const zSorted=[...ZONAS].sort((a,b)=>b.score-a.score);
  const scoreColor=s=>s>=85?'#7fe0b3':s>=70?'#cba45e':s>=55?'#d8be86':'#8d897e';
  const zcM=$('#zCardsMad'), zcE=$('#zCardsEsp');
  zSorted.forEach((z)=>{
    const col=scoreColor(z.score);
    const circ=L.circle(z.c,{radius:z.r,color:col,weight:1.8,dashArray:'6 7',fillColor:col,fillOpacity:.12,className:'zona-pulse'})
      .bindPopup(`<div class="pop-t">${z.n}</div><div class="pop-n">Score ${z.score}/100 · ${fmt(z.parque)} Porsches</div><div class="pop-d">${z.p}</div>`);
    znLayer.addLayer(circ);
    const card=document.createElement('div');card.className='zcard glass reveal';
    card.style.setProperty('--sc',col);
    card.innerHTML=`<div class="zscore" style="color:${col};border-color:${col}">${z.score}</div>
      <div class="zn">${z.reg==='Madrid'?'Madrid':'España'}</div><h4>${z.n}</h4>
      <div class="zmetrics">
        <div class="zm"><span>${fmt(z.parque)}</span>Porsches</div>
        <div class="zm"><span>${z.comp}</span>compet.</div>
        <div class="zm"><span>${(z.factEst/1000).toFixed(0)}k€</span>fact. pot.</div>
        <div class="zm"><span>${'★'.repeat(z.vis)}</span>visib.</div>
      </div>
      <p>${z.p}</p><span class="zbtn">Ver en el mapa →</span>`;
    card.querySelector('.zbtn').onclick=()=>{openFull();MAP.flyTo(z.c,11,{duration:1.4});circ.openPopup();};
    (z.reg==='Madrid'?zcM:zcE).appendChild(card);
  });
  znLayer.addTo(MAP);

  // toggles de capas
  const tg=(id,layer)=>{$(id).onchange=e=>{e.target.checked?layer.addTo(MAP):MAP.removeLayer(layer);};};
  tg('#lyOf',ofLayer);tg('#lyEs',esLayer);tg('#lyBt',btLayer);tg('#lyZn',znLayer);
  $('#lyProv').onchange=e=>{if(provLayer){e.target.checked?provLayer.addTo(MAP):MAP.removeLayer(provLayer);}};
  $('#lyMuni').onchange=e=>{if(muniLayer){e.target.checked?muniLayer.addTo(MAP):MAP.removeLayer(muniLayer);}};
  // toggle de texto (nombres talleres + números burbuja)
  $('#lyText').onchange=e=>{SHOW_TEXT=e.target.checked;document.body.classList.toggle('hide-text',!SHOW_TEXT);if(muniLayer&&$('#lyMuni').checked){MAP.removeLayer(muniLayer);muniLayer.addTo(MAP);}};
  // minimizar panel de capas
  $('#lbToggle').onclick=()=>{$('#layerbox').classList.toggle('mini');};
  // pantalla completa
  $('#fsBtn').onclick=toggleFull;

  $('#loading').style.display='none';
  update();
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.08});
  $$('.reveal').forEach(el=>io.observe(el));
}

/* pantalla completa */
function openFull(){if(!document.body.classList.contains('mapfull')){toggleFull();}}
function toggleFull(){
  const on=document.body.classList.toggle('mapfull');
  $('#fsBtn').textContent=on?'✕ Salir':'⛶ Pantalla completa';
  const filtersEl=$('.filters'), fsHost=$('#fsFilters'), origHost=$('#filtersHome');
  if(on){fsHost.appendChild(filtersEl);} else {origHost.appendChild(filtersEl);}
  setTimeout(()=>MAP.invalidateSize(),320);
  if(on){window.scrollTo(0,0);}
}

/* ---------- render ---------- */
let updTimer=null;
function update(){clearTimeout(updTimer);updTimer=setTimeout(doUpdate,90);}
function doUpdate(){
  const R=applyFilters();
  // KPIs
  $('#kTotal').textContent=fmt(R.total);
  $('#kPct').textContent=(R.total/D.rows.length*100).toFixed(1)+'% del parque nacional';
  $('#kGar').textContent=fmt(R.gar);
  $('#kClas').textContent=fmt(R.clas);
  let topP=null,topPn=0;
  for(const p in R.provC) if(R.provC[p]>topPn){topPn=R.provC[p];topP=p;}
  $('#kProv').textContent=topP?D.prov[String(topP).padStart(2,'0')]:'—';
  $('#kProvN').textContent=topP?fmt(topPn)+' vehículos':'';
  $('#fCount').textContent=fmt(R.total);

  // choropleth provincias
  if(provLayer) MAP.removeLayer(provLayer);
  const maxP=Math.max(1,...Object.values(R.provC));
  provLayer=L.geoJSON(GEO,{style:f=>{
    const code=parseInt(f.properties.cod_prov,10);
    const v=R.provC[code]||0;
    const t=v?Math.log(1+v)/Math.log(1+maxP):0;
    return {color:'rgba(216,190,134,.25)',weight:.7,fillColor:'#cba45e',fillOpacity:t*.55};
  },onEachFeature:(f,l)=>{
    const code=parseInt(f.properties.cod_prov,10);
    l.bindPopup(()=>`<div class="pop-t">${f.properties.name}</div><div class="pop-n">${fmt(applyFilters().provC[code]||0)} Porsches (con filtros)</div>`);
  }});
  if($('#lyProv').checked) provLayer.addTo(MAP);

  // burbujas municipios — número dentro + escala por volumen
  if(muniLayer) MAP.removeLayer(muniLayer);
  muniLayer=L.layerGroup();
  const entries=[...R.muniC.entries()];
  const maxM=Math.max(1,...entries.map(e=>e[1]));
  entries.forEach(([mi,n])=>{
    const m=D.munis[mi];if(!m)return;
    const r=Math.max(1,34*Math.sqrt(n/maxM));
    const showN=SHOW_TEXT && r>=15 && n>=3;
    const icon=L.divIcon({className:'',iconSize:[r*2,r*2],iconAnchor:[r,r],
      html:`<div class="bub" style="width:${r*2}px;height:${r*2}px">${showN?'<span>'+fmt(n)+'</span>':''}</div>`});
    const mk=L.marker([m[2],m[3]],{icon});
    mk.bindPopup(`<div class="pop-t">${m[1]}</div><div class="pop-n">${fmt(n)} Porsches (con filtros)</div>`);
    muniLayer.addLayer(mk);
  });
  if($('#lyMuni').checked) muniLayer.addTo(MAP);

  // rankings
  const bars=(host,items,labelFn)=>{
    const max=items.length?items[0][1]:1;
    $(host).innerHTML=items.map(([k,v])=>`<div class="bar"><div class="bl">${labelFn(k)}</div><div class="bt"><div class="bf" data-w="${(v/max*100).toFixed(1)}"></div></div><div class="bn">${fmt(v)}</div></div>`).join('');
    requestAnimationFrame(()=>$$(host+' .bf').forEach(b=>b.style.width=b.dataset.w+'%'));
  };
  bars('#topMunis',entries.sort((a,b)=>b[1]-a[1]).slice(0,12),mi=>D.munis[mi]?D.munis[mi][1]:'—');
  bars('#topProvs',Object.entries(R.provC).map(([k,v])=>[k,v]).sort((a,b)=>b[1]-a[1]).slice(0,12),p=>D.prov[String(p).padStart(2,'0')]||p);
}
