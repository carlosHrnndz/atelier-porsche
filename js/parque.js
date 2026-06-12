/* ============================================================
   Manufaktur Porsche · Observatorio del Parque (DGT 2026-03)
   ============================================================ */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fmt=n=>n.toLocaleString('es-ES');

/* ---------- TALLERES (censo editable: añade filas aquí) ----------
   tipo: 'of' oficial · 'es' especialista independiente · 'bt' boutique compraventa */
const TALLERES=[
 // — Centros oficiales Porsche —
 {t:'of',n:'Centro Porsche Madrid Norte',c:[40.494,-3.662],d:'A-1 Vía de Servicio 87, Madrid'},
 {t:'of',n:'Centro Porsche Madrid Oeste',c:[40.469,-3.876],d:'Ctra. A Coruña, Las Rozas'},
 {t:'of',n:'Centro Porsche Madrid Sur',c:[40.326,-3.764],d:'Zona sur, Madrid'},
 {t:'of',n:'Centro Porsche Barcelona',c:[41.354,2.121],d:'C/ Botánica 89, L\'Hospitalet'},
 {t:'of',n:'Centro Porsche Sant Cugat',c:[41.472,2.077],d:'Prat de la Riba 20, Sant Cugat'},
 {t:'of',n:'Centro Porsche Girona',c:[41.962,2.792],d:'Girona'},
 {t:'of',n:'Centro Porsche Lleida',c:[41.621,0.639],d:'Lleida'},
 {t:'of',n:'Centro Porsche Tarragona',c:[41.129,1.243],d:'Tarragona'},
 {t:'of',n:'Centro Porsche Valencia',c:[39.474,-0.452],d:'Av. Comarques 4-6, Quart de Poblet'},
 {t:'of',n:'Centro Porsche Alicante',c:[38.336,-0.518],d:'C/ Río Júcar 1, Alicante'},
 {t:'of',n:'Centro Porsche Málaga',c:[36.713,-4.463],d:'Málaga'},
 {t:'of',n:'Centro Porsche Marbella',c:[36.488,-4.952],d:'Ctra. Cádiz km 175, Puerto Banús'},
 {t:'of',n:'Centro Porsche Sevilla',c:[37.422,-5.932],d:'Av. Ruta de la Plata 3, Sevilla'},
 {t:'of',n:'Centro Porsche Zaragoza',c:[41.641,-0.931],d:'C/ Langa del Castillo 8'},
 {t:'of',n:'Centro Porsche Murcia',c:[38.024,-1.163],d:'Ctra. Madrid km 384, Espinardo'},
 {t:'of',n:'Centro Porsche Pamplona',c:[42.762,-1.636],d:'Pol. Talluntxe, Noain'},
 {t:'of',n:'Centro Porsche Bilbao',c:[43.231,-2.834],d:'Galdakao, Bizkaia'},
 {t:'of',n:'Centro Porsche A Coruña',c:[43.333,-8.323],d:'Av. das Mariñas 286, Oleiros'},
 {t:'of',n:'Centro Porsche Vigo',c:[42.222,-8.694],d:'Ctra. Madrid 152, Vigo'},
 {t:'of',n:'Centro Porsche Asturias',c:[43.414,-5.804],d:'Pol. Los Peñones, Lugones'},
 {t:'of',n:'Centro Porsche Valladolid',c:[41.672,-4.741],d:'Av. Burgos 74, Valladolid'},
 {t:'of',n:'Centro Porsche Baleares',c:[39.601,2.660],d:'Son Castelló, Palma'},
 {t:'of',n:'Centro Porsche Las Palmas',c:[28.108,-15.437],d:'Las Palmas de G.C.'},
 {t:'of',n:'Centro Porsche Tenerife',c:[28.461,-16.262],d:'S/C de Tenerife'},
 // — Especialistas independientes —
 {t:'es',n:'Valentín Motors Madrid',c:[40.336,-3.776],d:'Puig Adam 10, Leganés · desde 1979 · TECHART'},
 {t:'es',n:'Valentín Motors Barcelona',c:[41.373,2.135],d:'Ronda del Mig · clásicos y modernos'},
 {t:'es',n:'Targa Klassik',c:[40.438,-3.625],d:'C/ Miguel Yuste 13, Madrid · clásicos'},
 {t:'es',n:'GT Stradale',c:[40.371,-3.642],d:'Cno. Hormigueras 178, Madrid'},
 {t:'es',n:'Grupo Motorsport (Goya)',c:[40.426,-3.673],d:'Madrid centro · PIWIS'},
 {t:'es',n:'Grupo Motorsport (Alcobendas)',c:[40.541,-3.641],d:'Alcobendas'},
 {t:'es',n:'Tared Blau',c:[41.388,2.131],d:'Barcelona · taller boutique Porsche'},
 // — Boutiques / compraventa especializada —
 {t:'bt',n:'Tared Blau (venta)',c:[41.390,2.133],d:'Barcelona · Porsche seleccionados'},
 {t:'bt',n:'Box112',c:[40.553,-3.617],d:'S.S. de los Reyes · deportivos premium'}
];

/* ---------- ZONAS CANDIDATAS (datos calculados del registro) ---------- */
const ZONAS=[
 {n:'Arco Noroeste · A-6/M-50',c:[40.435,-3.875],r:9000,parque:3153,
  rank:'Candidata nº 1',
  p:'Pozuelo, Boadilla, Majadahonda, Las Rozas y Villaviciosa suman 3.153 Porsches — más que 47 provincias enteras — y NO hay ni un especialista independiente en la zona: Valentín está en Leganés y Targa/GT Stradale en el este. El único oficial (Madrid Oeste) no compite en precio. Desierto de servicio con el parque más denso per cápita de España.'},
 {n:'Corredor Norte · A-1',c:[40.548,-3.640],r:7000,parque:1821,
  rank:'Candidata nº 2',
  p:'Alcobendas + S.S. de los Reyes + La Moraleja: 1.821 Porsches y renta altísima. Contras: ya operan aquí el Centro Porsche Madrid Norte y un independiente (Grupo Motorsport). Entrar exige diferenciación clara — el diagnóstico a domicilio y el enfoque boutique serían la cuña.'},
 {n:'Marbella · Costa del Sol',c:[36.510,-4.885],r:11000,parque:1913,
  rank:'Comodín estratégico',
  p:'Marbella es el TERCER municipio de España por parque Porsche (1.913), por delante de Valencia. Cliente internacional, estacionalidad inversa a Madrid y solo el oficial de Puerto Banús como referencia. Lejos de vuestro plan actual, pero el dato merece estar sobre la mesa.'}
];

/* ---------- estado ---------- */
let D=null, GEO=null, MAP=null;
let provLayer=null, muniLayer=null, ofLayer=null, esLayer=null, btLayer=null, znLayer=null;
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
  MAP=L.map('map',{zoomControl:true,attributionControl:true,scrollWheelZoom:true,minZoom:5})
       .setView([40.0,-3.7],6);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {attribution:'© OpenStreetMap · © CARTO',subdomains:'abcd',maxZoom:18}).addTo(MAP);

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

  // capas talleres
  const mk=(cls,txt)=>L.divIcon({className:'',html:`<div class="mk ${cls}" style="width:26px;height:26px">${txt}</div>`,iconSize:[26,26],iconAnchor:[13,13]});
  ofLayer=L.layerGroup();esLayer=L.layerGroup();btLayer=L.layerGroup();
  TALLERES.forEach(t=>{
    const icon=t.t==='of'?mk('mk-of','P'):t.t==='es'?mk('mk-es','★'):mk('mk-bt','◆');
    const cat=t.t==='of'?'Centro oficial Porsche':t.t==='es'?'Especialista independiente':'Boutique · compraventa';
    const m=L.marker(t.c,{icon}).bindPopup(`<div class="pop-t">${t.n}</div><div class="pop-n">${cat}</div><div class="pop-d">${t.d}</div>`);
    (t.t==='of'?ofLayer:t.t==='es'?esLayer:btLayer).addLayer(m);
  });
  ofLayer.addTo(MAP);esLayer.addTo(MAP);btLayer.addTo(MAP);

  // zonas candidatas
  znLayer=L.layerGroup();
  const zc=$('#zCards');
  ZONAS.forEach((z,i)=>{
    const circ=L.circle(z.c,{radius:z.r,color:'#7fe0b3',weight:1.6,dashArray:'6 7',fillColor:'#54b58a',fillOpacity:.10,className:'zona-pulse'})
      .bindPopup(`<div class="pop-t">${z.n}</div><div class="pop-n">${z.rank} · ${fmt(z.parque)} Porsches en la zona</div><div class="pop-d">${z.p}</div>`);
    znLayer.addLayer(circ);
    const card=document.createElement('div');card.className='zcard glass reveal';
    card.innerHTML=`<div class="zn">${z.rank}</div><h4>${z.n}</h4>
      <div class="zkpi">${fmt(z.parque)}</div><div class="zkt">Porsches en la zona</div>
      <p>${z.p}</p><span class="zbtn">Ver en el mapa →</span>`;
    card.querySelector('.zbtn').onclick=()=>{MAP.flyTo(z.c,11,{duration:1.4});circ.openPopup();window.scrollTo({top:$('#map').getBoundingClientRect().top+window.scrollY-90,behavior:'smooth'});};
    zc.appendChild(card);
  });
  znLayer.addTo(MAP);

  // toggles de capas
  const tg=(id,layer)=>{$(id).onchange=e=>{e.target.checked?layer.addTo(MAP):MAP.removeLayer(layer);};};
  tg('#lyOf',ofLayer);tg('#lyEs',esLayer);tg('#lyBt',btLayer);tg('#lyZn',znLayer);
  $('#lyProv').onchange=e=>{if(provLayer){e.target.checked?provLayer.addTo(MAP):MAP.removeLayer(provLayer);}};
  $('#lyMuni').onchange=e=>{if(muniLayer){e.target.checked?muniLayer.addTo(MAP):MAP.removeLayer(muniLayer);}};

  $('#loading').style.display='none';
  update();
  // reveals
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.08});
  $$('.reveal').forEach(el=>io.observe(el));
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

  // burbujas municipios
  if(muniLayer) MAP.removeLayer(muniLayer);
  muniLayer=L.layerGroup();
  const entries=[...R.muniC.entries()];
  const maxM=Math.max(1,...entries.map(e=>e[1]));
  entries.forEach(([mi,n])=>{
    const m=D.munis[mi];if(!m)return;
    const r=3+14*Math.sqrt(n/maxM);
    const c=L.circleMarker([m[2],m[3]],{radius:r,color:'rgba(216,190,134,.85)',weight:1,fillColor:'#cba45e',fillOpacity:.45})
      .bindPopup(`<div class="pop-t">${m[1]}</div><div class="pop-n">${fmt(n)} Porsches (con filtros)</div>`);
    muniLayer.addLayer(c);
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
