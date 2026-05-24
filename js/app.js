/* ===== Atelier Porsche · Simulador v2 ===== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const isTouch=matchMedia('(hover:none)').matches;
const eur=n=>{const a=Math.round(n);return (a<0?"−":"")+"€"+Math.abs(a).toLocaleString('es-ES');};
const eurk=n=>{const a=Math.round(n/1000);return (a<0?"−":"")+"€"+Math.abs(a)+"k";};

/* ---------- STATE: every variable ---------- */
const S={
  // capital
  cap:125000, ico:45000, icoRate:0.055, icoTerm:72, icoCar:12,
  // CAPEX line items (build-up) -> total computed
  cx_obra:30000, cx_eleva:0, cx_herram:14000, cx_diag:7000, cx_aux:4000,
  cx_mob:7000, cx_it:0, cx_software:0, cx_rotulo:4000, cx_stock:6000,
  cx_fianza:5300, cx_licencia:10000,
  // leasing
  leaseVal:27000, leaseTerm:60, leaseRate:0.07,
  // local
  m2:250, eurm2:7,
  // revenue
  tar:105, ratio:0.67, mgn:0.50,
  // productivity model
  presence:160, prodStart:0.45, prodEnd:0.85, curve:0.82,
  // team
  ns:2, cse:3800,
  jefeSal:4000,            // jefe de mecánicos (mes 1)
  mecSal:3000, mecCount:0, mecMonth:6,   // mecánicos extra
  // other monthly fixed
  piwis:1000, sumi:900, seg:350, ges:300, mkt:1300,
  // horizon
  horizon:12
};

/* labels / help for every field */
const HELP={
  cap:"Dinero propio que aportáis los socios al arrancar. No se devuelve: es vuestro capital de riesgo. Ejemplo: si entre los dos ponéis 125.000 € de ahorros, ese es el capital propio.",
  ico:"Préstamo ICO destinado a colchón operativo, NO a comprar cosas. Da oxígeno durante los meses de pérdidas. Ejemplo: pides 45.000 € y los reservas para pagar nóminas mientras el taller aún no factura lo suficiente.",
  icoRate:"Tipo de interés anual del préstamo ICO. Orientativo 2026: 5-6%. Ejemplo: al 5,5%, un ICO de 45.000 € cuesta unos 2.475 € de intereses el primer año.",
  icoTerm:"Plazo total de devolución del ICO en meses. Ejemplo: 72 meses = 6 años para devolverlo; cuanto más largo, menor cuota mensual pero más intereses totales.",
  icoCar:"Meses de carencia: al principio solo pagas intereses (cuota baja), no capital. Ejemplo: con 12 meses de carencia, el primer año pagas ~206 €/mes en vez de ~720 €/mes.",
  leaseVal:"Valor del equipo financiado por leasing en vez de comprarlo. No sale de tu caja de golpe: lo pagas a plazos. Ejemplo: 27.000 € de elevadores y máquina A/C en leasing = ~535 €/mes en lugar de 27.000 € de golpe.",
  leaseTerm:"Plazo del leasing en meses. Ejemplo: 60 meses (5 años) es lo habitual para elevadores.",
  leaseRate:"Interés anual del leasing. Suele ser algo mayor que el ICO. Ejemplo: al 7%, financiar 27.000 € a 5 años añade ~5.000 € de intereses.",
  m2:"Superficie de la nave. Más m² = más alquiler, pero más boutique y más puestos de trabajo. Ejemplo: 250 m² dan para 2-3 elevadores más una zona de recepción tipo boutique.",
  eurm2:"Precio del alquiler por m² y mes. Madrid 2026: 4-9 €/m² según zona. Ejemplo: 250 m² × 7 €/m² = 1.750 €/mes de alquiler.",
  tar:"Tarifa por hora de mano de obra que cobras al cliente. Ejemplo: Valentín cobra ~105 €/h; de recién llegado conviene empezar en 90-95 € e ir subiendo con la reputación.",
  ratio:"Por cada euro de mano de obra, cuántos euros de recambios se venden. Ejemplo: en tu factura de Valentín, 598 € de mano de obra llevaron 403 € de recambios = ratio 0,67.",
  mgn:"Margen sobre los recambios (lo que ganas al revenderlos). Ejemplo: un filtro que compras a 30 € y facturas a 60 € = 50% de margen. Pieza OEM Porsche: margen menor.",
  presence:"Horas de PRESENCIA al mes de un mecánico full-time. Ejemplo: 20 días laborables × 8 h = 160 h. OJO: no es lo que factura, es lo que está en el taller.",
  prodStart:"% de las horas de presencia que realmente se facturan el primer mes. Al arrancar es bajo porque hay poca cartera. Ejemplo: 35% de 160 h = solo 56 h facturadas el mes 1.",
  prodEnd:"% de horas facturables al final, ya con el taller rodado. Ejemplo: 75% de 160 h = 120 h facturadas/mes; un taller muy bueno con baremos llega al 85%.",
  curve:"Forma de la rampa de clientes entre el inicio y el final. Ejemplo: con valor <1 los clientes llegan rápido al principio; con valor >1 el arranque es lento y acelera al final.",
  ns:"Número de socios que cobran sueldo. Cada socio suma coste fijo. Ejemplo: 2 socios a 3.800 € de coste empresa = 7.600 €/mes solo en vuestros sueldos.",
  cse:"Coste para la empresa por socio (sueldo neto + Seguridad Social + IRPF). Ejemplo: para que cobréis ~2.150 € netos, la empresa gasta ~3.800 € por cada socio.",
  jefeSal:"Coste empresa del jefe de mecánicos especializado. Es quien habilita la licencia y más produce al inicio. Ejemplo: un especialista Porsche ronda los 4.000 €/mes de coste total.",
  mecSal:"Coste empresa de cada mecánico adicional que contratéis. Ejemplo: un oficial de 1ª cuesta ~3.000 €/mes a la empresa.",
  mecCount:"Cuántos mecánicos extra (además del jefe) se incorporan. Ejemplo: pones 1 y, a partir del mes que elijas, hay 2 personas produciendo en vez de 1.",
  mecMonth:"A partir de qué mes entran esos mecánicos extra (y empiezan a costar y a producir). Ejemplo: si pones mes 8, contratas cuando ya tienes algo de cartera que justifique el sueldo.",
  piwis:"Diagnosis oficial Porsche (PIWIS). Ejemplo: la licencia cuesta ~12.000 €/año = 1.000 €/mes, pero es lo que te da credibilidad de especialista de verdad.",
  sumi:"Luz, agua, internet. Los elevadores y compresores consumen bastante. Ejemplo: un taller de 250 m² ronda los 900 €/mes.",
  seg:"Seguros de responsabilidad civil y multirriesgo del local. Ejemplo: ~350 €/mes para cubrir el taller y los coches de clientes.",
  ges:"Gestoría y contabilidad mensual. Ejemplo: una gestoría para una SL pequeña ronda 300 €/mes.",
  mkt:"Marketing, web, software de gestión y gastos varios. Ejemplo: 1.300 €/mes entre redes, software de taller y publicidad local.",
  horizon:"Cuántos meses proyectar la tesorería. Ejemplo: pon 12 para ver el primer año, o 24 para ver cuándo podrías encender la compraventa (Fase 2).",
  socioProd:"¿Los socios meten mano a los coches? Si sí, suman horas facturables como un mecánico. Si estudian o llevan la oficina, no. Ejemplo: mientras estudiáis el grado, ponlo en No; cuando acabéis, en Sí."
};

/* dynamic help for the 4 KPI cards */
function kpiHelp(){return {
  solv:`Te dice si el negocio sobrevive con caja positiva durante los ${S.horizon} meses proyectados, o en qué mes se queda sin dinero. Ejemplo: "Mes 6" significa que en el sexto mes la caja llega a cero y el negocio sería insolvente.`,
  caja:`El dinero que queda en la cuenta al final de los ${S.horizon} meses, después de todos los ingresos y gastos. Es tu colchón real. Ejemplo: 47.000 € significa que tras ${S.horizon} meses aún te quedan 47.000 € de margen para imprevistos.`,
  res:`El beneficio o pérdida del último mes proyectado (mes ${S.horizon}), ya sin contar el colchón acumulado. Te dice si el negocio gana dinero por sí mismo. Ejemplo: +1.123 € significa que el mes ${S.horizon} el taller ganó 1.123 € por su propia actividad.`,
  be:`Las horas facturables al mes que necesitáis para cubrir TODOS los costes (no ganar ni perder). Ejemplo: 128 h significa que con menos de 128 horas vendidas al mes perdéis dinero, y por encima empezáis a ganar.`
};}

/* CAPEX line item labels */
const CAPEX_ITEMS=[
  ['cx_obra','Obra y adaptación','Suelo epoxi, instalación eléctrica, recepción, zona boutique. El gran multiplicador.'],
  ['cx_eleva','Elevadores (compra)','Solo si NO van por leasing. Si están en leasing, déjalo a 0.'],
  ['cx_herram','Herramienta general','Carros, bancos, compresor, herramienta de mano.'],
  ['cx_diag','Diagnosis + herram. Porsche','Hardware de diagnosis y útiles específicos de la marca.'],
  ['cx_aux','Equipo auxiliar','Gatos, prensa, recambios de taller.'],
  ['cx_mob','Mobiliario boutique/oficina','Sofás, mostrador, decoración, mesas.'],
  ['cx_it','Informática','Ordenadores, TPV, pantallas, red.'],
  ['cx_software','Software (alta inicial)','Licencias y puesta en marcha del software de gestión.'],
  ['cx_rotulo','Rótulo y branding','Señalética, logotipo, imagen de marca física.'],
  ['cx_stock','Stock inicial consumibles','Aceites, filtros, líquidos para arrancar.'],
  ['cx_fianza','Fianza del local','Normalmente 2-3 meses de alquiler por adelantado.'],
  ['cx_licencia','Licencia + proyecto técnico','Licencia de actividad y proyecto de ingeniero.']
];

/* presets */
const presets={
  estudios:{ns:2,socioProd:false,cse:3800,jefeSal:4000,mecCount:0,m2:250,eurm2:7,cap:125000,ico:45000,tar:95,ratio:0.67,mgn:0.50,prodStart:0.35,prodEnd:0.72,curve:0.82},
  acabar:  {ns:2,socioProd:true, cse:3800,jefeSal:4000,mecCount:0,m2:250,eurm2:7,cap:125000,ico:45000,tar:105,ratio:0.67,mgn:0.50,prodStart:0.5,prodEnd:0.85,curve:0.82},
  unsocio: {ns:1,socioProd:true, cse:3800,jefeSal:4000,mecCount:0,m2:250,eurm2:7,cap:125000,ico:45000,tar:100,ratio:0.67,mgn:0.50,prodStart:0.45,prodEnd:0.82,curve:0.82},
  austero: {ns:2,socioProd:false,cse:2200,jefeSal:4000,mecCount:0,m2:200,eurm2:6.5,cap:125000,ico:30000,tar:95,ratio:0.67,mgn:0.50,prodStart:0.35,prodEnd:0.72,curve:0.82,sumi:600,seg:300,ges:250,mkt:700}
};
S.socioProd=false;

/* ---------- tooltip helper ---------- */
function helpIcon(key){return key&&HELP[key]?`<span class="help" data-help="${HELP[key].replace(/"/g,'&quot;')}">i</span>`:"";}

/* ---------- build controls ---------- */
const fields={};
function bindField(div){
  const f=div.dataset.f,min=+div.dataset.min,max=+div.dataset.max,step=+div.dataset.step;
  const label=div.dataset.label,unit=div.dataset.unit;
  div.classList.add('field');
  div.innerHTML=`<div class="lab"><span>${label} ${helpIcon(f)}</span></div>
    <div class="row"><input type="range" min="${min}" max="${max}" step="${step}" value="${S[f]}">
    <input class="num" type="number" min="${min}" max="${max}" step="${step}" value="${S[f]}"></div>`;
  const range=div.querySelector('input[type=range]'),num=div.querySelector('input.num');
  fields[f]={range,num,unit,min,max};
  const sync=v=>{v=Math.min(max,Math.max(min,isNaN(v)?min:v));S[f]=v;range.value=v;
    num.value=(unit==="%"||unit===""||unit==="x")?v:Math.round(v);clearActive();render();};
  range.addEventListener('input',e=>sync(+e.target.value));
  num.addEventListener('input',e=>sync(+e.target.value));
}
$$('[data-f]').forEach(bindField);

/* CAPEX items injected into #capexList */
const capexHost=$('#capexList');
if(capexHost){
  CAPEX_ITEMS.forEach(([f,label,help])=>{
    const d=document.createElement('div');
    d.className='field';
    d.innerHTML=`<div class="lab"><span>${label} <span class="help" data-help="${help.replace(/"/g,'&quot;')}">i</span></span><b id="cxv_${f}"></b></div>
      <input type="range" min="0" max="80000" step="500" value="${S[f]}">`;
    capexHost.appendChild(d);
    const range=d.querySelector('input');
    range.addEventListener('input',e=>{S[f]=+e.target.value;$('#cxv_'+f).textContent=eur(S[f]);clearActive();render();});
    fields[f]={range,isCapex:true};
  });
}

/* socios toggle */
$$('#ns button').forEach(b=>b.addEventListener('click',()=>{
  S.ns=+b.dataset.v;$$('#ns button').forEach(x=>x.classList.toggle('on',x===b));clearActive();render();}));
function setNs(v){S.ns=v;$$('#ns button').forEach(x=>x.classList.toggle('on',+x.dataset.v===v));}
/* socio productive toggle */
$$('#socioProd button').forEach(b=>b.addEventListener('click',()=>{
  S.socioProd=b.dataset.v==='1';$$('#socioProd button').forEach(x=>x.classList.toggle('on',x===b));clearActive();render();}));
function setSocioProd(v){S.socioProd=v;$$('#socioProd button').forEach(x=>x.classList.toggle('on',(x.dataset.v==='1')===v));}

/* presets */
function clearActive(){$$('.preset').forEach(p=>p.classList.remove('active'));}
function syncAll(){for(const f in fields){const ff=fields[f];if(ff.range)ff.range.value=S[f];
  if(ff.num){const u=ff.unit;ff.num.value=(u==="%"||u===""||u==="x")?S[f]:Math.round(S[f]);}
  if(ff.isCapex){const el=$('#cxv_'+f);if(el)el.textContent=eur(S[f]);}}}
$$('.preset').forEach(p=>p.addEventListener('click',()=>{
  Object.assign(S,presets[p.dataset.p]);setNs(S.ns);setSocioProd(S.socioProd);syncAll();
  clearActive();p.classList.add('active');render();}));

/* ---------- finance core ---------- */
function PMT(rate,nper,pv){if(rate===0)return pv/nper;return pv*rate/(1-Math.pow(1+rate,-nper));}
function capexTotal(){return CAPEX_ITEMS.reduce((s,[f])=>s+S[f],0);}

function compute(){
  const N=S.horizon;
  const alq=S.m2*S.eurm2;
  const leaseC=S.leaseVal>0?PMT(S.leaseRate/12,S.leaseTerm,S.leaseVal):0;
  const icoFull=S.ico>0?PMT(S.icoRate/12,S.icoTerm,S.ico):0;
  const icoInt=S.ico*S.icoRate/12;
  const capexT=capexTotal();
  const months=[];
  let caja=S.cap+S.ico-capexT, insolv=null, be=null, best=-1e12;

  for(let i=0;i<N;i++){
    // productive headcount this month
    let mechs = 1; // jefe always present from month 1
    if(i+1>=S.mecMonth) mechs += S.mecCount;
    const socioMechs = S.socioProd ? S.ns : 0;
    const totalProducers = mechs + socioMechs;
    // productivity ramp (shared S-curve)
    const t=N>1?Math.pow(i/(N-1),S.curve):1;
    const prod=S.prodStart+(S.prodEnd-S.prodStart)*t;
    const facturableHours = totalProducers * S.presence * prod;
    const mo=facturableHours*S.tar;
    const mc=mo+mo*S.ratio*S.mgn;
    // costs
    let salaries = S.cse*S.ns + S.jefeSal;
    if(i+1>=S.mecMonth) salaries += S.mecSal*S.mecCount;
    const icoPay=(i<S.icoCar)?icoInt:icoFull;
    const opex=alq+salaries+S.piwis+S.sumi+S.seg+S.ges+S.mkt+leaseC+icoPay;
    const res=mc-opex; const ini=caja; caja=ini+res;
    if(caja<0&&insolv===null) insolv=i+1;
    if(res>=0&&be===null) be=i+1;
    if(res>best) best=res;
    months.push({m:i+1,h:Math.round(facturableHours),prod,producers:totalProducers,mo,mc,opex,res,ini,fin:caja,salaries,alq,leaseC,icoPay});
  }
  const last=months[N-1];
  const beH=last.opex/(S.tar*(1+S.ratio*S.mgn));
  return {alq,leaseC,capexT,months,insolv,be,best,cajaFin:caja,beH,cajaIni:S.cap+S.ico-capexT};
}

/* ---------- render ---------- */
function render(){
  const R=compute();
  // CAPEX panel
  const capexT=R.capexT, disp=S.cap+S.ico;
  $('#capexTotal').textContent=eur(capexT);
  $('#capexDisp').textContent=eur(disp);
  $('#capexCaja').textContent=eur(R.cajaIni);
  const warn=$('#capexWarn');
  if(R.cajaIni<0){warn.hidden=false;warn.textContent=`⚠ El CAPEX (${eur(capexT)}) supera el capital disponible (${eur(disp)}). Reduce inversión, sube capital o pide más ICO.`;}
  else if(R.cajaIni<15000){warn.hidden=false;warn.textContent=`⚠ Colchón muy ajustado (${eur(R.cajaIni)}). Riesgo alto si la facturación tarda en arrancar.`;}
  else warn.hidden=true;

  // KPIs — dynamic labels + help text per horizon
  const KH=kpiHelp();
  $('#kl_solv').textContent='Estado a '+S.horizon+' meses';
  $('#kl_caja').textContent='Caja al mes '+S.horizon;
  $('#kl_res').textContent='Resultado mes '+S.horizon;
  $('#kl_be').textContent='Equilibrio';
  $('#h_solv').dataset.help=KH.solv;
  $('#h_caja').dataset.help=KH.caja;
  $('#h_res').dataset.help=KH.res;
  $('#h_be').dataset.help=KH.be;
  $('#ks_caja').textContent='colchón restante';
  // KPIs
  const kS=$('#k_solv');
  if(R.insolv){$('#v_solv').textContent="Mes "+R.insolv;$('#s_solv').textContent="se queda sin caja";kS.className="kpi glass danger";}
  else{$('#v_solv').textContent="Sobrevive";$('#s_solv').textContent=`caja + los ${S.horizon} meses`;kS.className="kpi glass ok";}
  $('#v_caja').textContent=eurk(R.cajaFin);$('#k_caja').className="kpi glass "+(R.cajaFin<0?"danger":"ok");
  $('#v_res').textContent=eur(R.best);$('#k_res').className="kpi glass "+(R.best<0?"danger":"ok");
  $('#s_res').textContent=R.be?("break-even en mes "+R.be):"nunca da beneficio";
  $('#v_be').textContent=Math.round(R.beH)+" h";
  const lastH=R.months[R.months.length-1].h, gap=Math.round(R.beH-lastH);
  $('#s_be').textContent=gap>0?("faltan "+gap+" h al final"):"alcanzable ✓";
  $('#k_be').className="kpi glass "+(gap>0?"danger":"ok");

  drawChart(R);
  drawDonut(R);
  drawInsight(R,gap);
  drawPnL(R);
}

/* cash chart */
function drawChart(R){
  const N=R.months.length;
  const W=880,H=360,padL=58,padR=18,padT=24,padB=46;
  const all=R.months.map(d=>d.fin).concat(R.months.map(d=>d.res)).concat([0,R.cajaIni]);
  let mx=Math.max(...all),mn=Math.min(...all);const pad=(mx-mn)*0.12||1000;mx+=pad;mn-=pad;
  const X=i=>padL+(N>1?i/(N-1):0.5)*(W-padL-padR), Y=v=>padT+(mx-v)/(mx-mn)*(H-padT-padB);
  let svg="";const yz=Y(0);
  for(let t=0;t<=5;t++){const v=mn+(mx-mn)*t/5,y=Y(v);
    svg+=`<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="var(--line)"/>`;
    svg+=`<text x="${padL-8}" y="${y+4}" text-anchor="end" font-size="11" fill="var(--mut2)" font-family="JetBrains Mono">${eurk(v)}</text>`;}
  svg+=`<line x1="${padL}" y1="${yz}" x2="${W-padR}" y2="${yz}" stroke="var(--red)" stroke-dasharray="4 4" opacity=".55"/>`;
  const bw=Math.max(5,Math.min(14,(W-padL-padR)/N*0.5));
  R.months.forEach((d,i)=>{const x=X(i),y0=Y(0),y1=Y(d.res),top=Math.min(y0,y1),h=Math.abs(y1-y0);
    svg+=`<rect x="${x-bw/2}" y="${top}" width="${bw}" height="${Math.max(h,1)}" rx="2" fill="${d.res>=0?'var(--green)':'var(--gold)'}" opacity=".32"/>`;});
  const pts=R.months.map((d,i)=>[X(i),Y(d.fin)]);
  const sx=padL,sy=Y(R.months[0].ini);
  let area=`M ${sx} ${yz} L ${sx} ${sy} `;pts.forEach(p=>area+=`L ${p[0]} ${p[1]} `);area+=`L ${pts[N-1][0]} ${yz} Z`;
  svg+=`<defs><linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--green)" stop-opacity=".30"/><stop offset="100%" stop-color="var(--green)" stop-opacity="0"/></linearGradient>
   <clipPath id="ab"><rect x="0" y="0" width="${W}" height="${yz}"/></clipPath><clipPath id="be"><rect x="0" y="${yz}" width="${W}" height="${H-yz}"/></clipPath></defs>`;
  svg+=`<path d="${area}" fill="url(#gp)" clip-path="url(#ab)"/><path d="${area}" fill="var(--red)" opacity=".16" clip-path="url(#be)"/>`;
  let line=`M ${sx} ${sy} `;pts.forEach(p=>line+=`L ${p[0]} ${p[1]} `);
  svg+=`<path d="${line}" fill="none" stroke="var(--green)" stroke-width="2.2" clip-path="url(#ab)"/><path d="${line}" fill="none" stroke="var(--red)" stroke-width="2.2" clip-path="url(#be)"/>`;
  const showEvery=N>14?Math.ceil(N/12):1;
  R.months.forEach((d,i)=>{const x=X(i),y=Y(d.fin);
    const info=`Mes ${d.m}  ·  Caja: ${eur(d.fin)}  ·  Resultado: ${eur(d.res)}  ·  ${d.h} h facturables  ·  ${d.producers} ${d.producers===1?'productor':'productores'}`;
    // big invisible hit circle for easy hover/touch
    svg+=`<circle class="pt-hit" cx="${x}" cy="${y}" r="14" fill="transparent" data-info="${info}" style="cursor:pointer"></circle>`;
    svg+=`<circle class="pt-dot" cx="${x}" cy="${y}" r="3" fill="${d.fin>=0?'var(--green-soft)':'var(--red-soft)'}" stroke="var(--bg)" stroke-width="1.5" pointer-events="none"></circle>`;
    if(i%showEvery===0||i===N-1) svg+=`<text x="${x}" y="${H-padB+20}" text-anchor="middle" font-size="10" fill="var(--mut)" font-family="JetBrains Mono" pointer-events="none">M${d.m}</text>`;});
  if(R.insolv){const x=X(R.insolv-1);
    svg+=`<line x1="${x}" y1="${padT}" x2="${x}" y2="${H-padB}" stroke="var(--red)" opacity=".4" stroke-dasharray="3 3"/>`;
    svg+=`<text x="${x}" y="${padT-6}" text-anchor="middle" font-size="11" fill="var(--red-soft)" font-family="JetBrains Mono" font-weight="600">sin caja</text>`;}
  $('#chart').innerHTML=svg;
  $('#tip').textContent=isTouch?"Toca un punto para ver el detalle del mes.":"Pasa el cursor por cada punto para ver el detalle.";
  // wire point tooltips
  $$('#chart .pt-hit').forEach(c=>{
    const show=e=>{const info=c.dataset.info;tipEl.textContent=info;
      const r=c.getBoundingClientRect();
      tipEl.style.left=Math.min(window.innerWidth-280,Math.max(8,r.left-120))+'px';
      tipEl.style.top=(window.scrollY+r.bottom+8)+'px';tipEl.classList.add('show');
      const dot=c.nextElementSibling; if(dot) dot.setAttribute('r','5');};
    const hide=()=>{tipEl.classList.remove('show');const dot=c.nextElementSibling; if(dot) dot.setAttribute('r','3');};
    c.addEventListener('mouseenter',show);
    c.addEventListener('mouseleave',hide);
    c.addEventListener('click',e=>{show(e);e.stopPropagation();});
  });
}

/* donut: where the monthly money goes (month 1 OPEX breakdown) */
function drawDonut(R){
  const m=R.months[0];
  const parts=[
    ['Salarios',m.salaries,'#cBA45e'],
    ['Alquiler',m.alq,'#d8be86'],
    ['PIWIS',S.piwis,'#8d897e'],
    ['Suministros',S.sumi,'#54b58a'],
    ['Seguros',S.seg,'#6e9ed8'],
    ['Gestoría',S.ges,'#b06ed8'],
    ['Marketing/varios',S.mkt,'#d86e8a'],
    ['Leasing',m.leaseC,'#5fd0c8'],
    ['ICO',m.icoPay,'#e0483a']
  ].filter(p=>p[1]>0);
  const total=parts.reduce((s,p)=>s+p[1],0);
  const cx=110,cy=110,r=78,sw=30;const C=2*Math.PI*r;let off=0;let svg="";
  parts.forEach(p=>{const frac=p[1]/total;const len=frac*C;
    svg+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p[2]}" stroke-width="${sw}"
      stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})"><title>${p[0]}: ${eur(p[1])} (${Math.round(frac*100)}%)</title></circle>`;
    off+=len;});
  svg+=`<text x="${cx}" y="${cy-6}" text-anchor="middle" font-size="13" fill="var(--mut)" font-family="Hanken Grotesk">OPEX/mes</text>`;
  svg+=`<text x="${cx}" y="${cy+16}" text-anchor="middle" font-size="20" fill="var(--ink)" font-family="Fraunces">${eur(total)}</text>`;
  $('#donut').innerHTML=svg;
  $('#donutLegend').innerHTML=parts.map(p=>`<span><i style="background:${p[2]}"></i>${p[0]} · <b>${eur(p[1])}</b></span>`).join('');
  // CAPEX breakdown bars
  const cxItems=CAPEX_ITEMS.map(([f,label])=>[label,S[f]]).filter(p=>p[1]>0).sort((a,b)=>b[1]-a[1]);
  const cxTotal=cxItems.reduce((s,p)=>s+p[1],0);const cxMax=cxItems.length?cxItems[0][1]:1;
  $('#capexBars').innerHTML=cxItems.map(p=>`<div class="bar"><span class="bl">${p[0]}</span>
    <span class="bt"><span class="bf" style="width:${p[1]/cxMax*100}%"></span></span>
    <span class="bv">${eur(p[1])}</span></div>`).join('')+
    `<div class="bar tot"><span class="bl">TOTAL CAPEX</span><span class="bt"></span><span class="bv">${eur(cxTotal)}</span></div>`;
}

function drawInsight(R,gap){
  let h;
  if(R.cajaIni<0){h=`<b>Configuración imposible.</b> Estás invirtiendo en CAPEX más dinero del que tienes. Ajusta la inversión o la financiación antes de mirar nada más.`;}
  else if(R.insolv){h=`<b>Inviable como está.</b> La caja se agota en el <b>mes ${R.insolv}</b>. `;
    h+=gap>0?`Aun al máximo de productividad seguís por debajo del equilibrio (faltan ${gap} h). Necesitáis más productores (contratar antes, socios produciendo) o menos coste fijo.`
            :`El pico cubre el equilibrio, pero la rampa es lenta para el colchón. Sube el ICO, acelera la productividad inicial o recorta CAPEX para dejar más caja.`;}
  else if(gap>0){h=`<b>Sobrevive, pero quema reservas.</b> Aguanta los ${S.horizon} meses por el colchón, pero a pleno rendimiento aún no llega al equilibrio (faltan ${gap} h). No es sostenible a largo plazo.`;}
  else if(!R.be){h=`<b>Al límite.</b> Hay caja pero ningún mes llega a beneficio. Compráis tiempo, no rentabilidad.`;}
  else{h=`<b>Configuración viable.</b> Break-even en el <b>mes ${R.be}</b> y cierre con <b>${eur(R.cajaFin)}</b> en caja a los ${S.horizon} meses. Base sólida para encender luego la Fase 2 (compraventa).`;}
  $('#insight').innerHTML=h;
}

/* ---------- P&L monthly table ---------- */
function drawPnL(R){
  const ms=R.months;
  const v=n=>n<0?`<span class="neg-val">${eur(n)}</span>`:eur(n);
  const cols=ms.map(d=>d.m);
  // header
  let h='<thead><tr><th></th>'+cols.map(m=>'<th>Mes '+m+'</th>').join('')+'</tr></thead>';
  h+='<tbody>';
  // --- INGRESOS ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'">Ingresos</td></tr>';
  h+='<tr><td>Horas facturables</td>'+ms.map(d=>'<td>'+d.h+' h</td>').join('')+'</tr>';
  h+='<tr><td>Productores</td>'+ms.map(d=>'<td>'+d.producers+'</td>').join('')+'</tr>';
  h+='<tr><td>Mano de obra</td>'+ms.map(d=>'<td>'+eur(d.mo)+'</td>').join('')+'</tr>';
  const partsMargin=ms.map(d=>d.mo*S.ratio*S.mgn);
  h+='<tr><td>Margen recambios</td>'+partsMargin.map(p=>'<td>'+eur(p)+'</td>').join('')+'</tr>';
  h+='<tr class="sub-total"><td>Total ingresos</td>'+ms.map(d=>'<td>'+eur(d.mc)+'</td>').join('')+'</tr>';
  // --- GASTOS ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'">Gastos fijos</td></tr>';
  h+='<tr><td>Salarios</td>'+ms.map(d=>'<td>'+eur(d.salaries)+'</td>').join('')+'</tr>';
  h+='<tr><td>Alquiler</td>'+ms.map(d=>'<td>'+eur(d.alq)+'</td>').join('')+'</tr>';
  h+='<tr><td>PIWIS</td>'+ms.map(()=>'<td>'+eur(S.piwis)+'</td>').join('')+'</tr>';
  h+='<tr><td>Suministros</td>'+ms.map(()=>'<td>'+eur(S.sumi)+'</td>').join('')+'</tr>';
  h+='<tr><td>Seguros</td>'+ms.map(()=>'<td>'+eur(S.seg)+'</td>').join('')+'</tr>';
  h+='<tr><td>Gestoría</td>'+ms.map(()=>'<td>'+eur(S.ges)+'</td>').join('')+'</tr>';
  h+='<tr><td>Marketing / varios</td>'+ms.map(()=>'<td>'+eur(S.mkt)+'</td>').join('')+'</tr>';
  if(R.leaseC>0) h+='<tr><td>Leasing</td>'+ms.map(d=>'<td>'+eur(d.leaseC)+'</td>').join('')+'</tr>';
  h+='<tr><td>Cuota ICO</td>'+ms.map(d=>'<td>'+eur(d.icoPay)+'</td>').join('')+'</tr>';
  h+='<tr class="sub-total"><td>Total gastos</td>'+ms.map(d=>'<td>'+eur(d.opex)+'</td>').join('')+'</tr>';
  // --- RESULTADO ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'"></td></tr>';
  h+='<tr class="grand '+(ms[ms.length-1].res>=0?'pos':'neg')+'"><td>Resultado del mes</td>'+ms.map(d=>'<td>'+v(d.res)+'</td>').join('')+'</tr>';
  h+='<tr class="cash"><td>Caja acumulada</td>'+ms.map(d=>'<td>'+v(d.fin)+'</td>').join('')+'</tr>';
  h+='</tbody>';
  $('#pnlTable').innerHTML=h;
}

/* ---------- tooltips ---------- */
let tipEl;
function showTip(h){
  const r=h.getBoundingClientRect();
  tipEl.textContent=h.dataset.help;
  tipEl.style.left=Math.min(window.innerWidth-260,Math.max(8,r.left))+'px';
  tipEl.style.top=(window.scrollY+r.bottom+8)+'px';
  tipEl.classList.add('show');
}
function hideTip(){tipEl.classList.remove('show');}
function bindHelpIcons(){
  $$('.help').forEach(h=>{
    h.addEventListener('mouseenter',()=>{if(!isTouch)showTip(h);});
    h.addEventListener('mouseleave',()=>{if(!isTouch)hideTip();});
    h.addEventListener('click',e=>{showTip(h);e.stopPropagation();});
  });
}
function initTips(){
  tipEl=document.createElement('div');tipEl.className='tooltip';document.body.appendChild(tipEl);
  document.addEventListener('click',e=>{if(!e.target.closest('.help'))hideTip();});
  bindHelpIcons();
}

/* ---------- parallax + reveals + tilt ---------- */
const layers=$$('.hero .layer');let ticking=false;
function parallax(){const y=window.scrollY,f=isTouch?0.4:1;
  layers.forEach(l=>{const d=parseFloat(l.dataset.depth)*f;l.style.transform=`translate3d(0,${y*d}px,0)`;});ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true;}},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
$$('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4*60)+'ms';io.observe(el);});
function tilt(el,max){if(isTouch)return;
  let frozen=false;
  el.addEventListener('mousemove',e=>{if(frozen)return;const r=el.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`rotateY(${px*max}deg) rotateX(${-py*max}deg)`;
    el.style.setProperty('--mx',(px+.5)*100+'%');el.style.setProperty('--my',(py+.5)*100+'%');});
  el.addEventListener('mouseleave',()=>{frozen=false;el.style.transform='rotateY(0) rotateX(0)';});
  el.querySelectorAll('.help').forEach(h=>{
    h.addEventListener('mouseenter',()=>{frozen=true;el.style.transform='rotateY(0) rotateX(0)';});
    h.addEventListener('mouseleave',()=>{frozen=false;});
  });
}
$$('.kpi').forEach(k=>tilt(k,7));

/* init */
initTips();
setSocioProd(false);
document.querySelector('.preset[data-p="estudios"]').classList.add('active');
syncAll();
render();
