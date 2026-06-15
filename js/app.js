/* ===== Atelier Porsche · Simulador v2 ===== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const isTouch=matchMedia('(hover:none)').matches;
const eur=n=>{const a=Math.round(n);return (a<0?"−":"")+"€"+Math.abs(a).toLocaleString('es-ES');};
const eurk=n=>{const a=Math.round(n/1000);return (a<0?"−":"")+"€"+Math.abs(a)+"k";};
const getProductLink=(opt,item)=>{
  let s=opt.fuente?opt.fuente.trim():'';
  const m=s.match(/\[.*?\]\((https?:\/\/.*?)\)/);
  if(m) return m[1];
  if(s.startsWith('http')) return s;
  return `https://www.google.com/search?q=${encodeURIComponent(item.nombre+' '+opt.modelo)}`;
};

/* ---------- STATE: every variable ---------- */
const S={
  // capital
  cap:125000, ico:45000, icoRate:0.055, icoTerm:72, icoCar:12,
  // CAPEX line items (build-up) -> total computed
  cx_obra:30000, cx_eleva:0, cx_herram:14000, cx_diag:7000, cx_aux:4000,
  cx_mob:7000, cx_it:0, cx_software:0, cx_rotulo:4000, cx_stock:6000,
  cx_fianza:5300, cx_licencia:10000,
  cx_domkit:6000, cx_neumatica:5500, cx_aircon:5000, cx_pintura:0, cx_alineadora:0,
  cx_carga:1500, cx_prensa:1200, cx_grua:900, cx_extrac:2500, cx_residuos:1800,
  cx_epis:1500, cx_mobtaller:3000,
  cx_pci:4000, cx_bie:0, cx_intrusion:2200,
  // leasing
  leaseVal:0,
  extFinVal:0, extFinTerm:60, extFinRate:0.05,
  // local
  m2:250, eurm2:7,
  // revenue
  tar:105, ratio:0.67, mgn:0.50,
  // productivity model
  presence:160, prodStart:0.45, prodEnd:0.85, curve:0.82,
  // team
  ns:2, cse:3800,
  socioProdPct:0.50,
  jefeSal:4000,            // jefe de mecánicos (mes 1)
  mecSal:3000, mecCount:0, mecMonth:6,   // mecánicos extra
  // other monthly fixed
  piwis:1000, sumi:900, seg:350, ges:300, mkt:1300,
  // limpieza + ropa laboral (obligatorio normativa)
  limpieza:450, lavadoMonos:180,
  // seguridad: mantenimiento contra incendios (RIPCI) + alarma conectada a central
  pciMant:40, cra:50,
  // recepcionista (opcional)
  recepEnable:0, recepMes:1, recepSal:1900,
  // suministros desglosados
  agua:60, internet:70,
  // chapa y pintura (subfase de la fase 1)
  cpEnable:0, cpMes:7, cpResponsableSal:2800, cpMaterialMes:1200, cpIngresoMes:6000,
  // socios productivos: cuántos de los 'ns' producen
  nsProd:2,
  // diagnóstico a domicilio (servicio diferencial)
  domEnable:1, domMes:1, domVehLease:420, domFuel:250, domSeg:90, domVisitsM:20, domFee:60, domHours:0.75,
  // ayudas / subvenciones (toggles 0/1)
  ay_tarifacero:1, ay_nuevoauto:1, ay_inversion:0, ay_kitdigital:1, ay_capitaliza:0, ay_contrata:0,
  // realismo fiscal y estacional
  estacional:1, mesApertura:6, impuestos:1, garantiaPct:0.02, ipc:0.03,
  // Fase 2 · compraventa
  f2Enable:0, f2MesInicio:15, f2CochesMes:0.5, f2Capital:22000, f2Margen:7000, f2CicloMeses:3, f2Horas:30,
  // horizon
  horizon:12,

  // Unit prices
  cx_eleva_price: 8000,
  cx_aircon_price: 5000,
  cx_bie_price: 600,
  cx_domkit_price: 6000,
  cx_carga_price: 1500,
  cx_prensa_price: 1200,
  cx_grua_price: 900,
  cx_alineadora_price: 15000,
  cx_pintura_price: 22000,
  cx_obra_price: 30000,
  cx_it_price: 1500,
  cx_software_price: 1000,
  cx_stock_price: 6000,
  cx_fianza_price: 5300,
  cx_neumatica_price: 5500,
  cx_extrac_price: 2500,
  cx_residuos_price: 1800,
  cx_epis_price: 1500,
  cx_mobtaller_price: 3000,
  cx_pci_price: 4000,
  cx_intrusion_price: 2200,

  cx_herram_carros_price: 1500,
  cx_herram_bancos_price: 1000,
  cx_herram_compresor_price: 3500,
  cx_herram_dinamo_price: 400,
  cx_herram_mano_price: 800,
  cx_herram_neumat_price: 700,

  cx_diag_piwis_price: 4500,
  cx_diag_utiles_price: 2500,

  cx_aux_gatos_price: 800,
  cx_aux_lavadora_price: 1200,
  cx_aux_aceite_price: 600,

  cx_mob_boutique_price: 3000,
  cx_mob_oficina_price: 1000,
  cx_mob_estanterias_price: 1000,

  cx_rotulo_lum_price: 2500,
  cx_rotulo_int_price: 1500,

  cx_licencia_proj_price: 6000,
  cx_licencia_tasas_price: 4000,

  // Quantities
  cx_eleva_qty: 0,
  cx_aircon_qty: 1,
  cx_bie_qty: 0,
  cx_domkit_qty: 1,
  cx_carga_qty: 1,
  cx_prensa_qty: 1,
  cx_grua_qty: 1,
  cx_alineadora_qty: 0,
  cx_pintura_qty: 0,
  cx_obra_qty: 1,
  cx_it_qty: 0,
  cx_software_qty: 0,
  cx_stock_qty: 1,
  cx_fianza_qty: 1,
  cx_neumatica_qty: 1,
  cx_extrac_qty: 1,
  cx_residuos_qty: 1,
  cx_epis_qty: 1,
  cx_mobtaller_qty: 1,
  cx_pci_qty: 1,
  cx_intrusion_qty: 1,

  cx_herram_carros_qty: 2,
  cx_herram_bancos_qty: 2,
  cx_herram_compresor_qty: 1,
  cx_herram_dinamo_qty: 3,
  cx_herram_mano_qty: 3,
  cx_herram_neumat_qty: 2,

  cx_diag_piwis_qty: 1,
  cx_diag_utiles_qty: 1,

  cx_aux_gatos_qty: 2,
  cx_aux_lavadora_qty: 1,
  cx_aux_aceite_qty: 2,

  cx_mob_boutique_qty: 1,
  cx_mob_oficina_qty: 2,
  cx_mob_estanterias_qty: 2,

  cx_rotulo_lum_qty: 1,
  cx_rotulo_int_qty: 1,

  cx_licencia_proj_qty: 1,
  cx_licencia_tasas_qty: 1
};

/* labels / help for every field */
const HELP={
  cap:"Dinero propio que aportáis los socios al arrancar. No se devuelve: es vuestro capital de riesgo. Ejemplo: si entre los dos ponéis 125.000 € de ahorros, ese es el capital propio.",
  ico:"Préstamo ICO destinado a colchón operativo, NO a comprar cosas. Da oxígeno durante los meses de pérdidas. Ejemplo: pides 45.000 € y los reservas para pagar nóminas mientras el taller aún no factura lo suficiente.",
  icoRate:"Tipo de interés anual del préstamo ICO. Orientativo 2026: 5-6%. Ejemplo: al 5,5%, un ICO de 45.000 € cuesta unos 2.475 € de intereses el primer año.",
  icoTerm:"Plazo total de devolución del ICO en meses. Ejemplo: 72 meses = 6 años para devolverlo; cuanto más largo, menor cuota mensual pero más intereses totales.",
  icoCar:"Meses de carencia: al principio solo pagas intereses (cuota baja), no capital. Ejemplo: con 12 meses de carencia, el primer año pagas ~206 €/mes en vez de ~720 €/mes.",
  leaseVal:"Suma de los precios del equipamiento adquirido vía leasing en el configurador avanzado.",
  extFinVal:"Dinero prestado por bancos o familiares para el capital inicial, separado de ICO y capital propio. Suma a la caja inicial y se devuelve mensualmente.",
  extFinTerm:"Plazo de devolución de la financiación externa en meses.",
  extFinRate:"Interés anual de la financiación externa.",
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
  piwis:"Diagnosis Porsche como COSTE FIJO mensual (no es una compra única). Con PPN: suscripción oficial vía Porsche Partner Network, ~12.000-18.000 €/año = 1.000-1.500 €/mes. Sin PPN pero con tester independiente: cuota/amortización similar (~1.200 €/mes). En el escenario 'sin PIWIS' ponlo a 0 aquí, porque el diagnóstico lo hace un escáner Autel comprado (va en CAPEX/equipamiento).",
  sumi:"Luz, agua, internet. Los elevadores y compresores consumen bastante. Ejemplo: un taller de 250 m² ronda los 900 €/mes.",
  seg:"Seguros de responsabilidad civil y multirriesgo del local. Ejemplo: ~350 €/mes para cubrir el taller y los coches de clientes.",
  ges:"Gestoría y contabilidad mensual. Ejemplo: una gestoría para una SL pequeña ronda 300 €/mes.",
  mkt:"Marketing, web, software de gestión y gastos varios. Ejemplo: 1.300 €/mes entre redes, software de taller y publicidad local.",
  horizon:"Cuántos meses proyectar la tesorería. Ejemplo: pon 12 para ver el primer año, o 24 para ver cuándo podrías encender la compraventa (Fase 2).",
  estacional:"Aplica la realidad del calendario de Madrid: agosto se desploma (cierre vacacional, ~35% de actividad), julio y diciembre flojean, y hay picos pre-ITV y pre-verano. Ejemplo: si tu colchón es justo, la muerte llega en septiembre, tras un agosto a medio gas.",
  mesApertura:"Mes del calendario en que abrís (1=enero … 12=diciembre). Sitúa los agostos en el lugar correcto de tu proyección. Ejemplo: si abres en septiembre (9), tu primer agosto-valle llega en tu mes 12 de actividad.",
  impuestos:"Aplica el Impuesto de Sociedades sobre el beneficio anual: 15% los dos primeros años con beneficio (tipo reducido de nuevas empresas), 25% después. Las pérdidas de un año compensan beneficios futuros. Ejemplo: 40.000 € de beneficio en el año 2 = ~6.000 € de impuesto que sale de caja.",
  garantiaPct:"Provisión para vuestra garantía de 1 año sin seguro: un % de la facturación se reserva para cubrir retrabajos y averías en garantía. Ejemplo: con 2% y 15.000 € facturados al mes, apartas 300 €/mes. Dar garantía sin provisionar es regalar un riesgo sin precio.",
  ipc:"Subida anual de costes (alquiler por IPC, salarios, suministros). Se aplica a partir del mes 13. Ejemplo: con 3% anual, el OPEX del mes 25 es ~6% mayor que el del mes 1. A 12 meses no afecta; a 36, mucho.",
  f2Enable:"Activa la Fase 2: comprar Porsche con potencial (ej. 987 con IMS sin hacer), reacondicionarlos en horas muertas del taller y venderlos certificados con garantía. Compra 'con miedo' (barato), vende 'sin miedo' (caro).",
  f2MesInicio:"Mes en que compráis el primer coche. REGLA DE ORO (premortem #5): nunca antes de 3 meses seguidos de caja positiva. El radar te avisará si lo programas demasiado pronto. Ejemplo: break-even en mes 11 → primer coche no antes del mes 14-15.",
  f2CochesMes:"Ritmo de compra. 0,5 = un coche cada dos meses; 1 = uno al mes. Ejemplo: empezar a 0,5 limita el capital congelado mientras aprendéis el ciclo completo de compra-reacondicionado-venta.",
  f2Capital:"Capital inmovilizado por coche: compra + transporte + piezas del reacondicionamiento. Ejemplo real (tu Boxster como referencia): compra a particular ~19.000 € + 500 € gestión + 2.500 € piezas = ~22.000 €.",
  f2Margen:"Beneficio bruto por coche vendido. Ejemplo: comprado 'con miedo' a 19.000 €, reacondicionado por 3.000 € y vendido certificado con garantía a 28.500 € = ~6.500-7.000 € de margen.",
  f2CicloMeses:"Meses que el capital está congelado por coche: desde que lo compras hasta que cobras la venta. Ejemplo: 1 mes de reacondicionado + 2 de venta = 3 meses. Si el mercado se enfría, este número crece y tu caja sufre.",
  f2Horas:"Horas de taller que consume reacondicionar cada coche. Se cubren primero con horas muertas (capacidad ociosa); solo restan facturación si el taller ya está lleno. Ejemplo: ~30 h por coche entre mecánica, IMS si toca, y puesta a punto.",
  limpieza:"Servicio de limpieza profesional del taller, oficina y baños. Un taller boutique tiene que estar impecable. Ejemplo: limpieza varios días/semana ronda 450 €/mes.",
  lavadoMonos:"Lavado industrial de la ropa de trabajo. Obligatorio por el RD 665/1997: los monos con aceites e hidrocarburos NO pueden lavarse en una lavadora normal, requieren lavandería industrial homologada. Ejemplo: servicio de recogida y entrega ~180 €/mes para un equipo pequeño.",
  pciMant:"Mantenimiento OBLIGATORIO de la protección contra incendios (RIPCI, RD 513/2017): revisión anual por empresa mantenedora habilitada, retimbrado de extintores cada 5 años e inspección OCA periódica. Ejemplo: ~40 €/mes (≈480 €/año) para un taller de 250 m². Sin esto, la inspección te cierra.",
  cra:"Alarma conectada a Central Receptora 24h. Con coches de clientes de 30-100k € dentro (y vuestro stock en Fase 2), el seguro lo exige y el sentido común también. Ejemplo: cuota CRA ~50 €/mes con aviso a policía.",
  recepEnable:"Contratar recepcionista/administrativo que atienda cliente, teléfono y agenda, liberando a los mecánicos para producir. En un taller boutique, la atención es parte del producto. Actívalo para incluir su coste.",
  recepMes:"Mes en que entra la recepcionista. Ejemplo: si pones 1, desde la apertura; si pones 6, cuando el volumen de clientes ya lo justifique.",
  recepSal:"Coste empresa de la recepcionista (sueldo + Seguridad Social). Ejemplo: ~1.900 €/mes para una jornada completa de administrativo.",
  agua:"Suministro de agua del taller (lavado de piezas, aseos, limpieza). Ejemplo: ~60 €/mes.",
  internet:"Internet, telefonía y conectividad (necesaria para PIWIS online y gestión). Ejemplo: ~70 €/mes fibra + móviles.",
  cpEnable:"Activa el servicio de chapa y pintura como subfase de la Fase 1. Suma una cabina de pintura, material e ingresos propios, pero también un responsable (chapista/pintor). Diferencia: poder entregar el coche acabado sin subcontratar.",
  cpMes:"Mes (desde la apertura) en que arranca chapa y pintura. Ejemplo: 7 = a los 6 meses de abrir, cuando el taller mecánico ya rueda.",
  cpResponsableSal:"Coste empresa del responsable de chapa y pintura. Ejemplo: un buen chapista-pintor ronda 2.800 €/mes.",
  cpMaterialMes:"Consumibles de pintura, masillas, imprimaciones, etc. al mes. Ejemplo: ~1.200 €/mes según volumen.",
  cpIngresoMes:"Facturación mensual estimada de chapa y pintura, ya en régimen. Ejemplo: 6.000 €/mes entre retoques, pintura de piezas y trabajos de carrocería premium.",
  nsProd:"Cuántos de los socios a sueldo realmente producen (meten mano a los coches). Ejemplo: 2 socios a sueldo pero solo 1 produce porque el otro lleva oficina, comercial y compraventa.",
  domMes:"Mes (desde la apertura) en que se activa el diagnóstico a domicilio. Ejemplo: 1 desde el principio como gancho comercial, o más tarde cuando tengáis el vehículo y la rutina montada.",
  domEnable:"Activa el servicio diferencial de diagnóstico a domicilio: vais a casa del cliente, diagnosticáis, y él sigue usando su coche hasta que llegan las piezas. Ponlo en Sí para incluir sus costes e ingresos.",
  domVehLease:"Cuota mensual del vehículo taller (furgoneta) para los desplazamientos a domicilio, vía renting. Ejemplo: una furgoneta en renting ronda 420 €/mes.",
  domFuel:"Combustible y mantenimiento del vehículo de domicilios. Ejemplo: ~250 €/mes según volumen de desplazamientos por Madrid.",
  domSeg:"Seguro adicional del vehículo taller. Ejemplo: ~90 €/mes.",
  domVisitsM:"Número de diagnósticos a domicilio que hacéis al mes. Ejemplo: 20 visitas/mes = 1 al día aproximadamente.",
  domFee:"Lo que cobráis por cada diagnóstico a domicilio. Ejemplo: 60 € por desplazamiento + diagnóstico; además capta trabajo para el taller.",
  domHours:"Horas facturables que consume cada visita a domicilio (del jefe o un mecánico). Ejemplo: 0,75 h = 45 minutos por visita, que se restan de la capacidad del taller.",
  socioProd:"¿Los socios meten mano a los coches? Si sí, suman horas facturables como un mecánico. Si estudian o llevan la oficina, no. Ejemplo: mientras estudiáis el grado, ponlo en No; cuando acabéis, en Sí.",
  socioProdPct:"Porcentaje de la jornada de cada socio dedicado a labores de mecánico. Si se dedican a la gestión o a otras labores, este porcentaje disminuye."
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
  ['cx_licencia','Licencia + proyecto técnico','Licencia de actividad y proyecto de ingeniero.'],
  ['cx_neumatica','Línea neumática + compresor','Compresor de calidad, secador de aire y red de tomas. Alimenta llaves de impacto y herramienta neumática. Ej: ~5.500 €.'],
  ['cx_aircon','Estación de carga A/C (R1234yf)','Máquina de aire acondicionado para gas moderno R1234yf, obligatorio en coches nuevos. Ej: ~5.000 €.'],
  ['cx_pintura','Cabina de pintado y secado','Cabina presurizada con horno/quemador de secado, zona de preparación de superficies, plenum de aspiración, filtros de carbón activo y pistolas aerográficas profesionales. Ej: ~22.000 €.'],
  ['cx_alineadora','Alineadora + equilibradora','Para dirección y ruedas. Caro; al inicio se puede externalizar (déjalo en 0). Ej: ~15.000 € si lo montas.'],
  ['cx_domkit','Kit diagnóstico a domicilio','Equipamiento portátil para diagnosticar en casa del cliente: PIWIS portátil, maletas, escáner, herramienta de mano. Ej: ~6.000 €.'],
  ['cx_carga','Cargador/arrancador baterías','Mantenedores y arrancador profesional. Ej: ~1.500 €.'],
  ['cx_prensa','Prensa hidráulica','Para rodamientos, silentblocks, casquillos. Ej: ~1.200 €.'],
  ['cx_grua','Grúa de motor + soporte','Para descolgar motores y cajas (clave en restauraciones). Ej: ~900 €.'],
  ['cx_extrac','Extracción de gases','Sistema de extracción de humos de escape, obligatorio para arrancar motores en interior. Ej: ~2.500 €.'],
  ['cx_residuos','Gestión de residuos (instalación)','Depósitos homologados de aceite usado, contenedores de residuos peligrosos. Ej: ~1.800 €.'],
  ['cx_epis','EPIs + ropa laboral inicial','Monos, guantes, gafas, calzado de seguridad para el equipo. Ej: ~1.500 €.'],
  ['cx_mobtaller','Mobiliario de taller','Bancos de trabajo, estanterías, armarios de herramienta. Ej: ~3.000 €.'],
  ['cx_pci','Protección contra incendios (PCI)','OBLIGATORIO por el RSCIEI (RD 164/2025): los talleres son riesgo medio-alto. Incluye extintores 21A-113B y CO2, detección y alarma (obligatoria en naves >300 m²), alumbrado de emergencia, señalización y armario de inflamables. Ej: ~4.000 € para 250 m². El proyecto PCI va dentro del proyecto técnico de licencia.'],
  ['cx_bie','Bocas de incendio (BIE)','Red de agua con mangueras. Exigible según superficie y nivel de riesgo del local (orientativo: naves grandes o riesgo alto). Ej: ~500-700 € por BIE instalada + red. Déjalo en 0 si tu nave no lo exige — lo determina el ingeniero del proyecto.'],
  ['cx_intrusion','Alarma anti-intrusión + CCTV','Con Porsches de clientes (y stock propio en Fase 2) durmiendo dentro, es innegociable y el seguro lo exigirá: alarma conectada a central receptora, cámaras, cierres de seguridad. Ej: ~2.200 € de instalación.']
];

/* presets */
/* ============ AYUDAS Y SUBVENCIONES (Madrid 2026) ============ */
/* Datos orientativos según fuentes oficiales 2026. Verificar siempre en BOCM/SEPE antes de contar con ellas. */
const AYUDAS=[
  {k:'ay_tarifacero', nivel:'C. Madrid', nombre:'Tarifa Cero autónomos',
   help:'QUÉ ES: la Comunidad de Madrid bonifica el 100% de la cuota de autónomo (incluido el MEI) durante el primer año. CUÁNTO: cubre los ~88 €/mes de la cuota reducida → ahorro de ~1.060 €/año por socio autónomo. REQUISITOS: ser nuevo autónomo en el RETA, estar acogido a la tarifa plana estatal, no estar en pluriactividad, domicilio fiscal en Madrid, estar al corriente con Hacienda y Seguridad Social. OJO: se cobra al final del primer año (pagas la cuota y luego te la reembolsan), y hay que solicitarla en los 3 meses siguientes. Incompatible con algunas otras ayudas autonómicas.',
   ahorroMes:88, perSocio:true, tipo:'opex'},
  {k:'ay_nuevoauto', nivel:'C. Madrid', nombre:'Ayuda nuevo autónomo',
   help:'QUÉ ES: subvención directa a fondo perdido para nuevos autónomos, para cubrir gastos iniciales de la actividad. CUÁNTO: hasta 5.600 € por beneficiario (6.200 € en casos especiales: parados de larga duración, pequeños municipios). REQUISITOS: alta nueva en el RETA, domicilio fiscal y social en Madrid, mantener la actividad un mínimo de tiempo, estar al corriente de pagos. Se solicita hasta 3 meses después del alta. Abierta todo el año hasta agotar presupuesto.',
   importe:5600, perSocio:true, tipo:'capex'},
  {k:'ay_inversion', nivel:'C. Madrid', nombre:'Ayuda a la inversión (microempresas)',
   help:'QUÉ ES: subvención para proyectos de inversión y expansión (maquinaria, equipamiento, ampliación de local, digitalización). CUÁNTO: hasta el 50% de la inversión, máximo 140.000-150.000 €. REQUISITO CLAVE: exige al menos 3 AÑOS de antigüedad de la empresa — por eso NO sirve para abrir, sino para la Fase 2 de expansión. Requiere plan de negocio (modelo CANVAS), matriz de riesgos y sede en Madrid. La activo aquí solo para que veas su impacto cuando llegue el momento.',
   pctInversion:0.30, tipo:'capex_pct'},
  {k:'ay_kitdigital', nivel:'Estado', nombre:'Kit Digital',
   help:'QUÉ ES: bono estatal (fondos europeos) para digitalizar el negocio: web, gestión, facturación, ciberseguridad. CUÁNTO: hasta 2.000 € (autónomo sin empleados, segmento III) o hasta 6.000 € (3-9 empleados, segmento II). REQUISITOS: estar dado de alta, cumplir el test de madurez digital, gastar el bono en soluciones de proveedores homologados. Es para software/digitalización, no para maquinaria.',
   importe:3000, tipo:'capex'},
  {k:'ay_capitaliza', nivel:'Estado', nombre:'Capitalización del paro (pago único)',
   help:'QUÉ ES: si tienes derecho a paro contributivo, puedes cobrarlo de golpe para invertirlo en el negocio. CUÁNTO: hasta el 100% de lo pendiente si eres menor de 30 (35 si mujer); 60% en el resto de casos. REQUISITOS: cobrar prestación contributiva (no subsidio), quedarte al menos 3 mensualidades pendientes, no haber capitalizado en los 4 años previos. Compatible con la tarifa plana. Desde 2026 (sentencia TSJ Madrid) puede usarse para amortizar préstamos de inversión, p. ej. un vehículo. Esto es capital propio extra, no una subvención: aquí lo modelo como aporte de capital.',
   importe:0, tipo:'info'},
  {k:'ay_contrata', nivel:'C. Madrid', nombre:'Ayuda a la contratación indefinida',
   help:'QUÉ ES: subvención por contratar de forma indefinida, especialmente a jóvenes, mujeres o parados de larga duración. CUÁNTO: entre 5.500 € y 7.500 € por trabajador (según colectivo y antigüedad en desempleo). REQUISITOS: contrato indefinido, dar de alta al trabajador antes de solicitar, plan de prevención de riesgos por escrito, al corriente de pagos. Hasta 10 contrataciones/año. Útil cuando contratéis al jefe de mecánicos o mecánicos extra.',
   importe:6000, tipo:'capex_hire'}
];

const presets={
  // 250 m² · PPN — PIWIS oficial como coste fijo (suscripción), equipo grande en leasing
  ppn:    {ns:2,socioProd:true,socioProdPct:0.80,cse:4000,jefeSal:4000,mecCount:0,m2:250,eurm2:10,cap:125000,ico:60000,tar:105,ratio:0.67,mgn:0.50,prodStart:0.18,prodEnd:0.85,curve:1.15,piwis:1200,recepEnable:1,recepMes:1},
  // 250 m² · no PPN — PIWIS independiente como coste fijo, equipo grande en leasing
  noppn:  {ns:2,socioProd:true,socioProdPct:0.80,cse:4000,jefeSal:4000,mecCount:0,m2:250,eurm2:10,cap:125000,ico:60000,tar:100,ratio:0.67,mgn:0.50,prodStart:0.18,prodEnd:0.85,curve:1.15,piwis:1200,recepEnable:1,recepMes:1},
  // 250 m² · no PPN SIN PIWIS — escáner genérico tope de gama (Autel) en CAPEX, sin coste fijo de diagnosis
  nopiwis:{ns:2,socioProd:true,socioProdPct:0.80,cse:4000,jefeSal:4000,mecCount:0,m2:250,eurm2:10,cap:125000,ico:60000,tar:98, ratio:0.67,mgn:0.50,prodStart:0.18,prodEnd:0.85,curve:1.15,piwis:0,recepEnable:1,recepMes:1}
};
S.socioProd=true;

function syncQtyAndPriceFromTotals() {
  // Deprecated in favor of catalog database state
}

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

function applyCatalogPreset(presetName) {
  if (!catalog) return;
  const LEASE_THRESHOLD = 2000; // ítems cuyo coste total supere esto van a leasing
  for (const catKey in catalog) {
    catalog[catKey].items.forEach((item, idx) => {
      if (item.nombre.startsWith("RECOMENDACION")) return;
      const itemKey = `${catKey}_${idx}`;
      const prio = item.prioridad; // 'Esencial', 'Recomendado', 'Opcional'

      // --- Selección base: esencial + recomendado entran; opcional fuera ---
      if (prio === 'Esencial' || prio === 'Recomendado') {
        S[itemKey + '_opt'] = 'A';
        S[itemKey + '_qty'] = 1;
      } else {
        S[itemKey + '_opt'] = '';
        S[itemKey + '_qty'] = 0;
      }

      // --- Diagnóstico: tratamiento especial según escenario ---
      if (itemKey === 'cx_diag_0') {
        // PIWIS oficial/independiente: NUNCA en CAPEX (va como coste fijo S.piwis), salvo decisión manual
        S[itemKey + '_opt'] = '';
        S[itemKey + '_qty'] = 0;
      }
      if (itemKey === 'cx_diag_1') {
        // Escáner multimarca: SOLO en el escenario sin PIWIS es el diagnóstico principal (CAPEX).
        // En PPN/no-PPN el diagnóstico ya lo cubre el PIWIS (coste fijo), así que no se duplica.
        if (presetName === 'nopiwis') {
          S[itemKey + '_opt'] = 'A';   // Autel MaxiSys Ultra
          S[itemKey + '_qty'] = 1;
        } else {
          S[itemKey + '_opt'] = '';
          S[itemKey + '_qty'] = 0;
        }
      }

      // --- Recalcular precio del ítem ---
      const opt = S[itemKey + '_opt'];
      let price = 0;
      if (opt) {
        const optObj = item.opciones.find(o => o.letra === opt);
        price = optObj ? optObj.precio : 0;
      }
      S[itemKey + '_price'] = price;

      // --- Leasing: todo equipo grande financiable va a renting/leasing ---
      const itemCost = (S[itemKey + '_qty'] || 0) * price;
      if (itemCost >= LEASE_THRESHOLD) {
        S[itemKey + '_lease'] = true;
        S[itemKey + '_leaseTerm'] = 60;
        S[itemKey + '_leaseRate'] = 0.08;
      } else {
        S[itemKey + '_lease'] = false;
      }
    });
  }
}

function recalculateCatalogTotals() {
  if (!catalog) return;
  let totalLeaseVal = 0;
  let totalLeaseC = 0;
  for (const catKey in catalog) {
    let catTotal = 0;
    catalog[catKey].items.forEach((item, idx) => {
      if (item.nombre.startsWith("RECOMENDACION")) return;
      const itemKey = `${catKey}_${idx}`;
      const opt = S[itemKey + '_opt'] || '';
      const qty = S[itemKey + '_qty'] || 0;
      let price = 0;
      if (opt) {
        const optObj = item.opciones.find(o => o.letra === opt);
        if (optObj) price = optObj.precio;
      }
      S[itemKey + '_price'] = price;
      
      const itemCost = qty * price;
      const isLeased = S[itemKey + '_lease'] || false;
      if (isLeased) {
        totalLeaseVal += itemCost;
        const leaseTerm = S[itemKey + '_leaseTerm'] || 60;
        const leaseRate = S[itemKey + '_leaseRate'] !== undefined ? S[itemKey + '_leaseRate'] : 0.07;
        const itemLeaseC = itemCost > 0 ? PMT(leaseRate / 12, leaseTerm, itemCost) : 0;
        totalLeaseC += itemLeaseC;
      } else {
        catTotal += itemCost;
      }
    });
    S[catKey] = catTotal;
  }
  S.leaseVal = totalLeaseVal;
  S.calculatedLeaseC = totalLeaseC;
}

function renderManualFields() {
  const manualItems = [
    ['cx_obra', 'Obra y adaptación', 'Suelo epoxi, instalación eléctrica, recepción, zona boutique. El gran multiplicador.'],
    ['cx_fianza', 'Fianza del local', 'Normalmente 2-3 meses de alquiler por adelantado.'],
    ['cx_licencia', 'Licencia + proyecto técnico', 'Licencia de actividad y proyecto de ingeniero.'],
    ['cx_rotulo', 'Rótulo y branding', 'Señalética, logotipo, imagen de marca física.'],
    ['cx_stock', 'Stock inicial consumibles', 'Aceites, filtros, líquidos para arrancar.']
  ];
  
  let html = '';
  manualItems.forEach(([f, label, help]) => {
    if (S[f+'_qty'] === undefined) S[f+'_qty'] = 1;
    if (S[f+'_price'] === undefined) S[f+'_price'] = S[f] || 0;
    S[f] = S[f+'_qty'] * S[f+'_price'];
    
    html += `
      <div class="field manual-field">
        <div class="lab"><span>${label} <span class="help" data-help="${help.replace(/"/g,'&quot;')}">i</span></span><b id="cxv_${f}" class="cx-total-val">${eur(S[f])}</b></div>
        <div class="cx-qty-row">
          <div class="cx-qty-col">
            <span class="cx-qty-label">Uds:</span>
            <input type="number" class="num cx-qty-input" id="cxqty_${f}" min="0" max="20" step="1" value="${S[f+'_qty']}">
          </div>
          <div class="cx-qty-col">
            <span class="cx-qty-label">Unit (€):</span>
            <input type="number" class="num cx-price-input" id="cxprc_${f}" min="0" max="100000" step="100" value="${S[f+'_price']}">
          </div>
        </div>
      </div>
    `;
  });
  return html;
}

function bindManualFieldsListeners() {
  const manualItems = ['cx_obra', 'cx_fianza', 'cx_licencia', 'cx_rotulo', 'cx_stock'];
  manualItems.forEach(f => {
    const qtyInp = $('#cxqty_' + f);
    const prcInp = $('#cxprc_' + f);
    if (qtyInp && prcInp) {
      const updateVal = () => {
        S[f+'_qty'] = Math.max(0, parseInt(qtyInp.value) || 0);
        S[f+'_price'] = Math.max(0, parseInt(prcInp.value) || 0);
        S[f] = S[f+'_qty'] * S[f+'_price'];
        const el = $('#cxv_' + f);
        if (el) el.textContent = eur(S[f]);
        clearActive();
        render();
      };
      qtyInp.addEventListener('input', updateVal);
      prcInp.addEventListener('input', updateVal);
      fields[f] = { qtyInp, prcInp, isCapex: true, isQty: true };
    }
  });
}

function renderCatalogUI() {
  const capexHost = $('#capexList');
  if (!capexHost || !catalog) return;
  
  let html = '';
  
  html += '<div class="manual-fields-group">';
  html += renderManualFields();
  html += '</div>';
  
  for (const catKey in catalog) {
    const cat = catalog[catKey];
    
    html += `
      <div class="acc-sub-container">
        <details class="acc-sub">
          <summary>
            <span>${cat.titulo}</span>
            <b id="cxv_${catKey}" class="cx-total-val">${eur(S[catKey] || 0)}</b>
          </summary>
          <div class="acc-sub-content">
    `;
    
    cat.items.forEach((item, idx) => {
      if (item.nombre.startsWith("RECOMENDACION")) return;
      const itemKey = `${catKey}_${idx}`;
      
      const optVal = S[itemKey + '_opt'] || '';
      const qtyVal = S[itemKey + '_qty'] !== undefined ? S[itemKey + '_qty'] : 0;
      
      const isMandatory = item.prioridad === 'Esencial';
      const badgeClass = isMandatory ? 'badge-mandatory' : 'badge-suggested';
      const badgeText = isMandatory ? 'Obligatorio' : 'Sugerencia';
      
      let selectHtml = `<select class="cx-item-select" id="cxopt_${itemKey}">`;
      selectHtml += `<option value="" ${optVal === '' ? 'selected' : ''}>Ninguno (0 €)</option>`;
      
      item.opciones.forEach(opt => {
        selectHtml += `<option value="${opt.letra}" ${optVal === opt.letra ? 'selected' : ''}>`;
        selectHtml += `Opción ${opt.letra}: ${opt.modelo} (${eur(opt.precio)})`;
        selectHtml += `</option>`;
      });
      selectHtml += `</select>`;
      
      const itemHelp = item.descripcion || item.notas || 'Sin descripción disponible.';
      
      html += `
        <div class="cx-item-row" id="cxrow_${itemKey}">
          <div class="cx-item-header">
            <div class="cx-item-name-wrap">
              <span>${item.nombre}</span>
              <span class="badge ${badgeClass}">${badgeText}</span>
              <span class="help" data-help="${itemHelp.replace(/"/g, '&quot;')}">i</span>
            </div>
            <span class="cx-item-price-val" id="cxval_${itemKey}">${eur(qtyVal * (S[itemKey + '_price'] || 0))}</span>
          </div>
          <div class="cx-item-controls">
            ${selectHtml}
            <input type="number" class="cx-item-qty-input" id="cxqty_${itemKey}" min="0" max="50" step="1" value="${qtyVal}" ${optVal === '' ? 'disabled' : ''}>
            <span style="font-size: 11px; color: var(--mut)">Uds</span>
          </div>
        </div>
      `;
    });
    
    html += `
          </div>
        </details>
      </div>
    `;
  }
  
  capexHost.innerHTML = html;
  bindManualFieldsListeners();
  bindCatalogListeners();
  bindHelpIcons();
}

function bindCatalogListeners() {
  if (!catalog) return;
  
  for (const catKey in catalog) {
    catalog[catKey].items.forEach((item, idx) => {
      if (item.nombre.startsWith("RECOMENDACION")) return;
      const itemKey = `${catKey}_${idx}`;
      
      const optSelect = $('#cxopt_' + itemKey);
      const qtyInput = $('#cxqty_' + itemKey);
      const priceVal = $('#cxval_' + itemKey);
      
      if (!optSelect || !qtyInput) return;
      
      const updateItem = () => {
        const opt = optSelect.value;
        let qty = parseInt(qtyInput.value) || 0;
        
        if (opt === '') {
          qty = 0;
          qtyInput.value = 0;
          qtyInput.disabled = true;
          S[itemKey + '_price'] = 0;
        } else {
          qtyInput.disabled = false;
          if (qty <= 0) {
            qty = 1;
            qtyInput.value = 1;
          }
          const optObj = item.opciones.find(o => o.letra === opt);
          S[itemKey + '_price'] = optObj ? optObj.precio : 0;
        }
        
        S[itemKey + '_opt'] = opt;
        S[itemKey + '_qty'] = qty;
        
        const totalCost = qty * S[itemKey + '_price'];
        if (priceVal) priceVal.textContent = eur(totalCost);
        
        let catTotal = 0;
        catalog[catKey].items.forEach((it, i) => {
          if (it.nombre.startsWith("RECOMENDACION")) return;
          const k = `${catKey}_${i}`;
          const q = S[k + '_qty'] || 0;
          const p = S[k + '_price'] || 0;
          catTotal += q * p;
        });
        S[catKey] = catTotal;
        const catValEl = $('#cxv_' + catKey);
        if (catValEl) catValEl.textContent = eur(catTotal);
        
        clearActive();
        render();
      };
      
      optSelect.addEventListener('change', updateItem);
      qtyInput.addEventListener('input', updateItem);
    });
  }
}

function initCatalogState() {
  if (!catalog) return;
  for (const catKey in catalog) {
    if (S[catKey] === undefined) {
      S[catKey] = 0;
    }
    catalog[catKey].items.forEach((item, idx) => {
      if (item.nombre.startsWith("RECOMENDACION")) return;
      const itemKey = `${catKey}_${idx}`;
      
      if (S[itemKey + '_opt'] === undefined) {
        if (item.prioridad === 'Esencial') {
          S[itemKey + '_opt'] = 'A';
          S[itemKey + '_qty'] = 1;
          const optA = item.opciones.find(o => o.letra === 'A');
          S[itemKey + '_price'] = optA ? optA.precio : 0;
        } else {
          S[itemKey + '_opt'] = '';
          S[itemKey + '_qty'] = 0;
          S[itemKey + '_price'] = 0;
        }
      }
      if (S[itemKey + '_lease'] === undefined) S[itemKey + '_lease'] = false;
      if (S[itemKey + '_leaseTerm'] === undefined) S[itemKey + '_leaseTerm'] = 60;
      if (S[itemKey + '_leaseRate'] === undefined) S[itemKey + '_leaseRate'] = 0.07;
    });
  }
}

/* socios toggle */
$$('#ns button').forEach(b=>b.addEventListener('click',()=>{
  S.ns=+b.dataset.v;$$('#ns button').forEach(x=>x.classList.toggle('on',x===b));clearActive();render();}));
function setNs(v){S.ns=v;$$('#ns button').forEach(x=>x.classList.toggle('on',+x.dataset.v===v));}
/* socio productive toggle */
$$('#socioProd button').forEach(b=>b.addEventListener('click',()=>{
  S.socioProd=b.dataset.v==='1';$$('#socioProd button').forEach(x=>x.classList.toggle('on',x===b));clearActive();render();}));
function setSocioProd(v){S.socioProd=v;$$('#socioProd button').forEach(x=>x.classList.toggle('on',(x.dataset.v==='1')===v));}
/* diagnóstico a domicilio toggle */
$$('#domEnable button').forEach(b=>b.addEventListener('click',()=>{
  S.domEnable=b.dataset.v==='1'?1:0;$$('#domEnable button').forEach(x=>x.classList.toggle('on',x===b));clearActive();render();}));
function setDomEnable(v){S.domEnable=v?1:0;$$('#domEnable button').forEach(x=>x.classList.toggle('on',(x.dataset.v==='1')===!!v));}
/* toggles de realismo y fase 2 */
function bindSimpleToggle(id,key){
  $$('#'+id+' button').forEach(b=>b.addEventListener('click',()=>{
    S[key]=b.dataset.v==='1'?1:0;$$('#'+id+' button').forEach(x=>x.classList.toggle('on',x===b));clearActive();render();}));
}
function setSimpleToggle(id,key){$$('#'+id+' button').forEach(x=>x.classList.toggle('on',(x.dataset.v==='1')===!!S[key]));}
bindSimpleToggle('estacionalT','estacional');
bindSimpleToggle('impuestosT','impuestos');
bindSimpleToggle('f2EnableT','f2Enable');

/* presets */
function clearActive(){$$('.preset').forEach(p=>p.classList.remove('active'));}
function syncAll(){
  recalculateCatalogTotals();
  for(const f in fields){
    const ff=fields[f];
    if(ff.isQty){
      if(ff.qtyInp) ff.qtyInp.value=S[f+'_qty'];
      if(ff.prcInp) ff.prcInp.value=S[f+'_price'];
    } else {
      if(ff.range)ff.range.value=S[f];
      if(ff.num){const u=ff.unit;ff.num.value=(u==="%"||u===""||u==="x")?S[f]:Math.round(S[f]);}
    }
    if(ff.isCapex){const el=$('#cxv_'+f);if(el)el.textContent=eur(S[f]);}
  }
  
  if (catalog) {
    for (const catKey in catalog) {
      catalog[catKey].items.forEach((item, idx) => {
        if (item.nombre.startsWith("RECOMENDACION")) return;
        const itemKey = `${catKey}_${idx}`;
        const optSelect = $('#cxopt_' + itemKey);
        const qtyInput = $('#cxqty_' + itemKey);
        const priceVal = $('#cxval_' + itemKey);
        
        if (optSelect && qtyInput) {
          const optVal = S[itemKey + '_opt'] || '';
          const qtyVal = S[itemKey + '_qty'] || 0;
          
          optSelect.value = optVal;
          qtyInput.value = qtyVal;
          qtyInput.disabled = (optVal === '');
          
          const totalCost = qtyVal * (S[itemKey + '_price'] || 0);
          if (priceVal) priceVal.textContent = eur(totalCost);
        }
      });
      const catValEl = $('#cxv_' + catKey);
      if (catValEl) catValEl.textContent = eur(S[catKey] || 0);
    }
  }
}
$$('.preset').forEach(p=>p.addEventListener('click',()=>{
  const presetName = p.dataset.p;
  Object.assign(S,presets[presetName]);
  applyCatalogPreset(presetName);
  setNs(S.ns);setSocioProd(S.socioProd);
  setSimpleToggle('recepEnableT','recepEnable');setSimpleToggle('cpEnableT','cpEnable');
  setDomEnable(S.domEnable);
  syncAll();
  clearActive();p.classList.add('active');render();}));

/* ---------- finance core ---------- */
function PMT(rate,nper,pv){if(rate===0)return pv/nper;return pv*rate/(1-Math.pow(1+rate,-nper));}
function capexTotal(){
  let sum = (S.cx_obra || 0) + (S.cx_fianza || 0) + (S.cx_licencia || 0) + (S.cx_rotulo || 0) + (S.cx_stock || 0);
  if (catalog) {
    for (const catKey in catalog) {
      sum += S[catKey] || 0;
    }
  }
  return sum;
}

function compute(){
  recalculateCatalogTotals();
  const manualItems = ['cx_obra', 'cx_fianza', 'cx_licencia', 'cx_rotulo', 'cx_stock'];
  manualItems.forEach(f => {
    if (S[f+'_qty'] !== undefined && S[f+'_price'] !== undefined) {
      S[f] = S[f+'_qty'] * S[f+'_price'];
    }
  });
  const N=S.horizon;
  const alq=S.m2*S.eurm2;
  const leaseC=S.calculatedLeaseC || 0;
  const icoFull=S.ico>0?PMT(S.icoRate/12,S.icoTerm,S.ico):0;
  const icoInt=S.ico*S.icoRate/12;
  const extFinPay=S.extFinVal>0?PMT(S.extFinRate/12,S.extFinTerm,S.extFinVal):0;
  const capexT=capexTotal();
  const months=[];
  // ---- AYUDAS Y SUBVENCIONES ----
  const nSocios=S.ns;
  let ayudaCapexInicial=0;       // subvenciones a fondo perdido que entran como caja extra al inicio
  let ayudaOpexMes=0;            // ahorros recurrentes mensuales (ej. tarifa cero)
  let ayudaContrata=0;          // por contratación (entra cuando se contrata)
  AYUDAS.forEach(a=>{
    if(!S[a.k]) return;
    if(a.tipo==='capex'){ ayudaCapexInicial += a.importe * (a.perSocio?nSocios:1); }
    else if(a.tipo==='capex_pct'){ ayudaCapexInicial += capexT * a.pctInversion; }
    else if(a.tipo==='opex'){ ayudaOpexMes += a.ahorroMes * (a.perSocio?nSocios:1); }
    else if(a.tipo==='capex_hire'){ ayudaContrata += a.importe; } // por el jefe de mecánicos
  });
  let caja=S.cap+S.ico-capexT*1.21+ayudaCapexInicial, insolv=null, be=null, best=-1e12;

  // estacionalidad Madrid (ene..dic): agosto se desploma, jul/dic flojos, picos pre-ITV y pre-verano
  const SEASON=[1,1,1.05,1,1.05,1.10,0.90,0.35,1.05,1,1,0.85];
  // impuesto de sociedades: acumulador anual + bases negativas
  let annAcc=0, lossCarry=0;

  const dom = S.domEnable ? 1 : 0;
  for(let i=0;i<N;i++){
    // productive headcount this month
    let mechs = 1; // jefe always present from month 1
    if(i+1>=S.mecMonth) mechs += S.mecCount;
    // socios que producen: nsProd (limitado a ns), a socioProdPct de jornada
    const sociosProductores = Math.min(S.nsProd, S.ns);
    const socioMechs = S.socioProd ? (sociosProductores * S.socioProdPct) : 0;
    let totalProducers = mechs + socioMechs;
    // chapa y pintura: el responsable añade capacidad productiva desde su mes
    const cpActive = S.cpEnable && (i+1>=S.cpMes);
    if(cpActive) totalProducers += 1;
    // productivity ramp (shared S-curve)
    const t=N>1?Math.pow(i/(N-1),S.curve):1;
    const prod=S.prodStart+(S.prodEnd-S.prodStart)*t;
    // estacionalidad según mes de calendario real
    const calMonth=((S.mesApertura-1)+i)%12;
    const season=S.estacional?SEASON[calMonth]:1;
    const capacity = totalProducers * S.presence;
    let facturableHours = capacity * prod * season;
    // domicilio: activo desde su mes; consume horas pero trae ingresos
    const domOn = dom && (i+1>=S.domMes);
    const domVisits = domOn ? S.domVisitsM * Math.min(1, 0.4+0.6*t) * season : 0;
    const domHoursUsed = domVisits * S.domHours;
    facturableHours = Math.max(0, facturableHours - domHoursUsed);
    // ---- FASE 2 · compraventa ----
    let f2Out=0, f2In=0, f2MarginRealized=0;
    if(S.f2Enable){
      if(i+1>=S.f2MesInicio){
        f2Out = S.f2CochesMes * S.f2Capital;
        const recondHours = S.f2CochesMes * S.f2Horas;
        const idle = Math.max(0, capacity - facturableHours - domHoursUsed);
        if(recondHours > idle) facturableHours = Math.max(0, facturableHours - (recondHours - idle));
      }
      if(i+1-S.f2CicloMeses>=S.f2MesInicio){
        f2In = S.f2CochesMes * (S.f2Capital + S.f2Margen);
        f2MarginRealized = S.f2CochesMes * S.f2Margen;
      }
    }
    const mo=facturableHours*S.tar;
    const domIncome = domVisits * S.domFee;
    // chapa y pintura: ingreso propio escalado por estacionalidad
    const cpIncome = cpActive ? S.cpIngresoMes * season : 0;
    const mc=mo + mo*S.ratio*S.mgn + domIncome + cpIncome;
    // FACTURACIÓN TOTAL del mes (taller + domicilio + chapa + ventas F2)
    const facturacion = mc + f2In;
    // provisión de garantía: % de la facturación de servicio
    const garProv = S.garantiaPct * (mo + mo*S.ratio + cpIncome);
    // costs (con IPC a partir del año 2)
    const ipcF = Math.pow(1+S.ipc, Math.floor(i/12));
    let salaries = (S.cse*S.ns + S.jefeSal) * ipcF;
    if(i+1>=S.mecMonth) salaries += S.mecSal*S.mecCount*ipcF;
    if(S.recepEnable && i+1>=S.recepMes) salaries += S.recepSal*ipcF;
    if(cpActive) salaries += S.cpResponsableSal*ipcF;
    const icoPay=(i<S.icoCar)?icoInt:icoFull;
    const domCost = domOn ? (S.domVehLease+S.domFuel+S.domSeg)*ipcF : 0;
    const cpMaterial = cpActive ? S.cpMaterialMes*ipcF : 0;
    let opex=(alq+S.piwis+S.sumi+S.agua+S.internet+S.seg+S.ges+S.mkt+S.limpieza+S.lavadoMonos+S.pciMant+S.cra)*ipcF + salaries + domCost + cpMaterial + leaseC + icoPay + extFinPay;
    if(i<12) opex -= ayudaOpexMes;
    let ayudaPuntual=0;
    if(i===0 && ayudaContrata>0) ayudaPuntual += ayudaContrata;
    if(i+1===S.mecMonth && S.mecCount>0 && S['ay_contrata']) ayudaPuntual += 6000*S.mecCount;
    const resOperativo = mc - opex - garProv + f2MarginRealized + ayudaPuntual;
    annAcc += resOperativo;
    let taxPay=0;
    if(S.impuestos && (i+1)%12===0){
      if(annAcc>0){
        const taxable=Math.max(0, annAcc-lossCarry);
        lossCarry=Math.max(0, lossCarry-annAcc);
        const rate=(Math.floor(i/12)<2)?0.15:0.25;
        taxPay=taxable*rate;
      } else lossCarry += -annAcc;
      annAcc=0;
    }
    const beneficioBruto = mc - cpMaterial + f2MarginRealized;
    const netProfit = resOperativo - taxPay;
    const res=mc-opex+ayudaPuntual-garProv-f2Out+f2In-taxPay;
    let ivaRefund = 0;
    if (i === 3) ivaRefund = capexT * 0.21;
    const ini=caja;
    caja=ini+res+ivaRefund;
    // margen %: resultado operativo sobre facturación del mes
    const margenPct = facturacion>0 ? ((mc-opex-garProv)/facturacion) : 0;
    if(caja<0&&insolv===null) insolv=i+1;
    if(netProfit>=0&&be===null) be=i+1;
    if(netProfit>best) best=netProfit;
    months.push({m:i+1,h:Math.round(facturableHours),prod,producers:totalProducers,mo,mc,facturacion,margenPct,opex,res,ini,fin:caja,salaries,alq,leaseC,icoPay,extFinPay,limpieza:S.limpieza,lavadoMonos:S.lavadoMonos,domCost,domIncome,cpIncome,cpMaterial,domVisits:Math.round(domVisits),ayudaPuntual,season,garProv,f2Out,f2In,taxPay,ivaRefund,beneficioBruto,resOperativo,netProfit,f2MarginRealized});
  }
  const lastM = months[months.length - 1];
  const cpActiveLast = S.cpEnable && (N >= S.cpMes);
  const cpIncomeLast = cpActiveLast ? S.cpIngresoMes * lastM.season : 0;
  const domVisitsLast = lastM.domVisits;
  const domIncomeLast = domVisitsLast * S.domFee;
  const f2MarginRealizedLast = S.f2Enable && (N - S.f2CicloMeses >= S.f2MesInicio) ? S.f2CochesMes * S.f2Margen : 0;
  const hourlyMargin = S.tar * (1 + S.ratio * S.mgn - S.garantiaPct * (1 + S.ratio));
  const fixedCosts = lastM.opex + S.garantiaPct * cpIncomeLast - domIncomeLast - cpIncomeLast - f2MarginRealizedLast - lastM.ayudaPuntual;
  const beH = hourlyMargin > 0 ? Math.max(0, fixedCosts / hourlyMargin) : 0;

  return {alq,leaseC,capexT,months,insolv,be,best,cajaFin:caja,beH,cajaIni:S.cap+S.ico+S.extFinVal-capexT*1.21+ayudaCapexInicial,ayudaCapexInicial,ayudaOpexMes};
}

/* ---------- render ---------- */
function render(){
  const R=compute();
  // CAPEX panel
  const capexT=R.capexT, disp=S.cap+S.ico;
  const capexIva = capexT * 0.21;
  const capexConIva = capexT * 1.21;
  $('#capexTotal').textContent=eur(capexT);
  $('#capexIva').textContent=eur(capexIva);
  $('#capexConIva').textContent=eur(capexConIva);
  $('#capexDisp').textContent=eur(disp);
  $('#capexCaja').textContent=eur(R.cajaIni);
  const warn=$('#capexWarn');
  if(R.cajaIni<0){warn.hidden=false;warn.textContent=`⚠ El CAPEX con IVA (${eur(capexConIva)}) supera el capital disponible (${eur(disp)}). Reduce inversión, sube capital o pide más ICO.`;}
  else if(R.cajaIni<15000){warn.hidden=false;warn.textContent=`⚠ Colchón inicial con IVA muy ajustado (${eur(R.cajaIni)}). Riesgo alto si la facturación tarda en arrancar.`;}
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

  const valLeaseVal = $('#valLeaseVal');
  const valLeaseC = $('#valLeaseC');
  if(valLeaseVal) valLeaseVal.textContent = eur(S.leaseVal || 0);
  if(valLeaseC) valLeaseC.textContent = eur(S.calculatedLeaseC || 0) + '/mes';

  drawChart(R);
  drawDonut(R);
  drawInsight(R,gap);
  renderRisks(R);
  renderPnl(R);
  pulseKpis();
  drawPnL(R);
}

const chartLayers = {
  caja: true,
  facturacion: true,
  beneficio: true,
  gastos: true
};

/* cash chart */
function drawChart(R){
  const N=R.months.length;
  const W=880,H=360,padL=58,padR=18,padT=24,padB=46;
  
  // Calculate dynamic axis limits
  const all=[0];
  if(chartLayers.caja){
    all.push(R.cajaIni);
    R.months.forEach(d=>all.push(d.fin));
  }
  if(chartLayers.facturacion){
    R.months.forEach(d=>all.push(d.facturacion));
  }
  if(chartLayers.beneficio){
    R.months.forEach(d=>all.push(d.netProfit));
  }
  if(chartLayers.gastos){
    R.months.forEach(d=>all.push(d.opex));
  }
  
  let mx=Math.max(...all),mn=Math.min(...all);
  const pad=(mx-mn)*0.12||1000;mx+=pad;mn-=pad;
  
  // Custom Y limits from inputs
  const yMinEl = document.getElementById('chartYMin');
  const yMaxEl = document.getElementById('chartYMax');
  if (yMinEl && yMinEl.value !== '') {
    const customMin = parseFloat(yMinEl.value);
    if (!isNaN(customMin)) mn = customMin;
  }
  if (yMaxEl && yMaxEl.value !== '') {
    const customMax = parseFloat(yMaxEl.value);
    if (!isNaN(customMax)) mx = customMax;
  }
  if (mx <= mn) mx = mn + 1000;

  const X=i=>padL+(N>1?i/(N-1):0.5)*(W-padL-padR), Y=v=>padT+(mx-v)/(mx-mn)*(H-padT-padB);
  const yz=Y(0);
  
  let svg=`<defs>
    <clipPath id="chart-plot-clip"><rect x="${padL}" y="${padT}" width="${W-padL-padR}" height="${H-padT-padB}"/></clipPath>
    <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--green)" stop-opacity=".30"/><stop offset="100%" stop-color="var(--green)" stop-opacity="0"/></linearGradient>
    <clipPath id="ab"><rect x="0" y="0" width="${W}" height="${yz}"/></clipPath>
    <clipPath id="be"><rect x="0" y="${yz}" width="${W}" height="${H-yz}"/></clipPath>
  </defs>`;
  
  // Y-axis grid lines and labels (NOT clipped)
  for(let t=0;t<=5;t++){
    const v=mn+(mx-mn)*t/5,y=Y(v);
    svg+=`<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="var(--line)"/>`;
    svg+=`<text x="${padL-8}" y="${y+4}" text-anchor="end" font-size="11" fill="var(--mut2)" font-family="JetBrains Mono">${eurk(v)}</text>`;
  }
  
  // Open clipped plot group
  svg+=`<g clip-path="url(#chart-plot-clip)">`;
  
  // Red dashed line for 0
  svg+=`<line x1="${padL}" y1="${yz}" x2="${W-padR}" y2="${yz}" stroke="var(--red)" stroke-dasharray="4 4" opacity=".55"/>`;
  
  const bw=Math.max(5,Math.min(14,(W-padL-padR)/N*0.5));
  
  // 1. Beneficio (Bars + Interactive Points)
  if(chartLayers.beneficio){
    const maxAbsRes = Math.max(...R.months.map(d=>Math.abs(d.netProfit)), 1);
    R.months.forEach((d,i)=>{
      const x=X(i),y0=Y(0),y1=Y(d.netProfit),top=Math.min(y0,y1),h=Math.abs(y1-y0);
      const ratio = Math.abs(d.netProfit) / maxAbsRes;
      const op = 0.15 + 0.70 * ratio;
      const color = d.netProfit >= 0 ? 'var(--green)' : 'var(--red)';
      svg+=`<rect class="chart-layer-beneficio" x="${x-bw/2}" y="${top}" width="${bw}" height="${Math.max(h,1)}" rx="2" fill="${color}" opacity="${op}"/>`;
      
      const dotColor = d.netProfit >= 0 ? 'var(--green-soft)' : 'var(--red-soft)';
      const info = `Bº Neto (Mes ${d.m}): ${eur(d.netProfit)}<br><span style="font-size:10.5px; opacity:0.8;">Bº Bruto: ${eur(d.beneficioBruto)}</span>`;
      svg+=`<circle class="pt-hit" cx="${x}" cy="${y1}" r="12" fill="transparent" data-info="${info}" style="cursor:pointer"></circle>`;
      svg+=`<circle class="pt-dot chart-layer-beneficio" cx="${x}" cy="${y1}" r="3.2" fill="${dotColor}" stroke="var(--bg)" stroke-width="1.5" pointer-events="none"></circle>`;
    });
  }
  
  // 2. Caja (Line, Area & Interactive Points)
  if(chartLayers.caja){
    const pts=R.months.map((d,i)=>[X(i),Y(d.fin)]);
    const sx=padL,sy=Y(R.months[0].ini);
    let area=`M ${sx} ${yz} L ${sx} ${sy} `;pts.forEach(p=>area+=`L ${p[0]} ${p[1]} `);area+=`L ${pts[N-1][0]} ${yz} Z`;
    svg+=`<path class="chart-layer-caja" d="${area}" fill="url(#gp)" clip-path="url(#ab)"/><path class="chart-layer-caja" d="${area}" fill="var(--red)" opacity=".16" clip-path="url(#be)"/>`;
    let line=`M ${sx} ${sy} `;pts.forEach(p=>line+=`L ${p[0]} ${p[1]} `);
    svg+=`<path class="chart-layer-caja" d="${line}" fill="none" stroke="var(--green)" stroke-width="2.2" clip-path="url(#ab)"/><path class="chart-layer-caja" d="${line}" fill="none" stroke="var(--red)" stroke-width="2.2" clip-path="url(#be)"/>`;
    pts.forEach(([x,y], i)=>{
      const d = R.months[i];
      const dotColor = d.fin >= 0 ? 'var(--green-soft)' : 'var(--red-soft)';
      const info = `Caja (Mes ${d.m}): ${eur(d.fin)}`;
      svg+=`<circle class="pt-hit" cx="${x}" cy="${y}" r="12" fill="transparent" data-info="${info}" style="cursor:pointer"></circle>`;
      svg+=`<circle class="pt-dot chart-layer-caja" cx="${x}" cy="${y}" r="3.2" fill="${dotColor}" stroke="var(--bg)" stroke-width="1.5" pointer-events="none"></circle>`;
    });
  }
  
  // 3. Facturación (Line & Interactive Points)
  if(chartLayers.facturacion){
    const ptsFact=R.months.map((d,i)=>[X(i),Y(d.facturacion)]);
    let lineFact=`M ${ptsFact[0][0]} ${ptsFact[0][1]} `;
    ptsFact.slice(1).forEach(p=>lineFact+=`L ${p[0]} ${p[1]} `);
    svg+=`<path class="chart-layer-facturacion" d="${lineFact}" fill="none" stroke="var(--gold)" stroke-width="2.2" opacity=".85"/>`;
    ptsFact.forEach(([x,y], i)=>{
      const d = R.months[i];
      const info = `Facturación (Mes ${d.m}): ${eur(d.facturacion)}<br><span style="font-size:10.5px; opacity:0.8;">Horas: ${d.h} h facturables</span>`;
      svg+=`<circle class="pt-hit" cx="${x}" cy="${y}" r="12" fill="transparent" data-info="${info}" style="cursor:pointer"></circle>`;
      svg+=`<circle class="pt-dot chart-layer-facturacion" cx="${x}" cy="${y}" r="3.2" fill="var(--gold-soft)" stroke="var(--bg)" stroke-width="1.5" pointer-events="none"></circle>`;
    });
  }
  
  // 4. Gastos (Line & Interactive Points)
  if(chartLayers.gastos){
    const ptsGast=R.months.map((d,i)=>[X(i),Y(d.opex)]);
    let lineGast=`M ${ptsGast[0][0]} ${ptsGast[0][1]} `;
    ptsGast.slice(1).forEach(p=>lineGast+=`L ${p[0]} ${p[1]} `);
    svg+=`<path class="chart-layer-gastos" d="${lineGast}" fill="none" stroke="var(--purple)" stroke-width="2.2" opacity=".85"/>`;
    ptsGast.forEach(([x,y], i)=>{
      const d = R.months[i];
      const info = `Gastos (Mes ${d.m}): ${eur(d.opex)}`;
      svg+=`<circle class="pt-hit" cx="${x}" cy="${y}" r="12" fill="transparent" data-info="${info}" style="cursor:pointer"></circle>`;
      svg+=`<circle class="pt-dot chart-layer-gastos" cx="${x}" cy="${y}" r="3.2" fill="var(--purple-soft)" stroke="var(--bg)" stroke-width="1.5" pointer-events="none"></circle>`;
    });
  }
  
  // Insolv line
  if(R.insolv && chartLayers.caja){
    const x=X(R.insolv-1);
    svg+=`<line x1="${x}" y1="${padT}" x2="${x}" y2="${H-padB}" stroke="var(--red)" opacity=".4" stroke-dasharray="3 3"/>`;
    svg+=`<text x="${x}" y="${padT-6}" text-anchor="middle" font-size="11" fill="var(--red-soft)" font-family="JetBrains Mono" font-weight="600">sin caja</text>`;
  }
  
  // Close clipped plot group
  svg+=`</g>`;
  
  // X-axis Month Labels (NOT clipped)
  const showEvery=N>14?Math.ceil(N/12):1;
  R.months.forEach((d,i)=>{
    const x=X(i);
    if(i%showEvery===0||i===N-1) svg+=`<text x="${x}" y="${H-padB+20}" text-anchor="middle" font-size="10" fill="var(--mut)" font-family="JetBrains Mono" pointer-events="none">M${d.m}</text>`;
  });
  
  $('#chart').innerHTML=svg;
  $('#tip').textContent=isTouch?"Toca un punto para ver el detalle del mes.":"Pasa el cursor por cada punto para ver el detalle.";
  
  // wire point tooltips
  $$('#chart .pt-hit').forEach(c=>{
    const show=e=>{
      const info=c.dataset.info;
      tipEl.innerHTML=info;
      const r=c.getBoundingClientRect();
      tipEl.style.left=Math.min(window.innerWidth-280,Math.max(8,r.left-120))+'px';
      tipEl.style.top=(window.scrollY+r.bottom+8)+'px';
      tipEl.classList.add('show');
      const dot=c.nextElementSibling;
      if(dot) dot.setAttribute('r','5.5');
    };
    const hide=()=>{
      tipEl.classList.remove('show');
      const dot=c.nextElementSibling;
      if(dot) dot.setAttribute('r','3.2');
    };
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
    ['Domicilio (vehículo)',m.domCost,'#e3a857'],
    ['PIWIS',S.piwis,'#8d897e'],
    ['Suministros',S.sumi+S.agua+S.internet,'#54b58a'],
    ['Recepción',(S.recepEnable?S.recepSal:0),'#c9a0d6'],
    ['Chapa y pintura',(S.cpEnable?S.cpResponsableSal+S.cpMaterialMes:0),'#d6a05f'],
    ['Limpieza',S.limpieza,'#7ec8a0'],
    ['Lavado monos',S.lavadoMonos,'#9ad6c0'],
    ['PCI + alarma CRA',S.pciMant+S.cra,'#c98f4a'],
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
  const cols=['0'].concat(ms.map(d=>d.m));
  let h='<thead><tr><th>Concepto</th>'+cols.map(m=>'<th>M'+m+'</th>').join('')+'</tr></thead>';
  h+='<tbody>';
  
  // Helpers
  const rowHtml = (label, fn, cls) => {
    return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + label + '</td>' + cols.map((m, idx) => {
      const isM0 = m === '0';
      const monthObj = isM0 ? null : ms[idx - 1];
      const v = fn(monthObj, isM0);
      if (v === null || v === undefined) return '<td>—</td>';
      return '<td style="color:' + (v < 0 ? 'var(--red-soft)' : 'inherit') + '">' + (v < 0 ? '−' : '') + eur(Math.abs(v)) + '</td>';
    }).join('') + '</tr>';
  };

  // --- INGRESOS BRUTOS ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'">Ingresos Brutos (Facturación)</td></tr>';
  h+=rowHtml('Mano de obra taller', (m, isM0)=>isM0 ? null : m.mo);
  h+=rowHtml('Ventas de recambios', (m, isM0)=>isM0 ? null : m.mo*S.ratio);
  h+=rowHtml('Diagnóstico a domicilio', (m, isM0)=>isM0 ? null : m.domIncome);
  if(S.cpEnable) h+=rowHtml('Chapa y pintura (ingresos)', (m, isM0)=>isM0 ? null : m.cpIncome);
  if(S.f2Enable) h+=rowHtml('Compraventa Fase 2 (ventas)', (m, isM0)=>isM0 ? null : m.f2In);
  h+=rowHtml('TOTAL INGRESOS BRUTOS', (m, isM0)=>isM0 ? null : (m.mo + m.mo*S.ratio + m.domIncome + (m.cpIncome||0) + (m.f2In||0)), 'sub-total');

  // --- COSTES DIRECTOS ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'">Costes Directos de Ventas (COGS)</td></tr>';
  h+=rowHtml('Coste de recambios', (m, isM0)=>isM0 ? null : -m.mo*S.ratio*(1-S.mgn));
  if(S.cpEnable) h+=rowHtml('Material chapa y pintura', (m, isM0)=>isM0 ? null : -m.cpMaterial);
  if(S.f2Enable) h+=rowHtml('Coste de coches vendidos (Fase 2)', (m, isM0)=>isM0 ? null : -(m.f2In - (m.f2MarginRealized||0)));
  h+=rowHtml('TOTAL COSTES DIRECTOS', (m, isM0)=>isM0 ? null : -(m.mo*S.ratio*(1-S.mgn) + (m.cpMaterial||0) + (m.f2In - (m.f2MarginRealized||0))), 'sub-total');

  // --- BENEFICIO BRUTO ---
  h+=rowHtml('BENEFICIO BRUTO (Margen)', (m, isM0)=>isM0 ? null : m.beneficioBruto, 'pnl-gross-row');

  // --- OPEX ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'">Gastos de Estructura y Estacionales</td></tr>';
  h+=rowHtml('Gastos operativos (OPEX sin mat. pintura)', (m, isM0)=>isM0 ? null : -(m.opex - (m.cpMaterial||0)));
  h+=rowHtml('Provisión de garantía', (m, isM0)=>isM0 ? null : -m.garProv);
  h+=rowHtml('Subvenciones y ayudas recurrentes/puntuales', (m, isM0)=>isM0 ? null : m.ayudaPuntual || null);

  // --- IMPUESTOS Y PROVISIONES ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'">Impuestos</td></tr>';
  h+=rowHtml('Impuesto de Sociedades (IS)', (m, isM0)=>isM0 ? null : (m.taxPay ? -m.taxPay : null));

  // --- BENEFICIO NETO ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'">Resultado Operativo (P&L)</td></tr>';
  const maxAbsResTable = Math.max(...ms.map(d=>Math.abs(d.netProfit)), 1);
  const formatResCell = (res, isM0) => {
    if (isM0) return '<td>—</td>';
    const ratio = Math.abs(res) / maxAbsResTable;
    const alpha = ratio * 0.45;
    const bg = res >= 0 ? `rgba(84, 181, 138, ${alpha})` : `rgba(224, 72, 58, ${alpha})`;
    const textCol = res >= 0 ? 'var(--green-soft)' : 'var(--red-soft)';
    return `<td style="background:${bg}; color:${textCol}; font-weight:600;">${(res < 0 ? '−' : '') + eur(Math.abs(res))}</td>`;
  };
  h+='<tr class="grand pnl-net-row"><td>Beneficio Neto (Resultado del mes)</td>'+cols.map((m, idx) => {
    if (m === '0') return formatResCell(0, true);
    return formatResCell(ms[idx - 1].netProfit, false);
  }).join('')+'</tr>';

  // --- CAJA ---
  h+='<tr class="sec-label"><td colspan="'+(cols.length+1)+'">Evolución de Caja y Conciliación</td></tr>';
  h+=rowHtml('Caja inicial del mes', (m, isM0)=>isM0 ? 0 : m.ini);
  h+=rowHtml('(+) Aportaciones capital y préstamos (ICO)', (m, isM0)=>isM0 ? (S.cap + S.ico) : null);
  h+=rowHtml('(+) Subvención inversión inicial', (m, isM0)=>isM0 ? R.ayudaCapexInicial || null : null);
  h+=rowHtml('(-) Inversión inicial CAPEX (base)', (m, isM0)=>isM0 ? -R.capexT : null);
  h+=rowHtml('(-) Pago IVA CAPEX (21% de inversión)', (m, isM0)=>isM0 ? -(R.capexT * 0.21) : null);
  h+=rowHtml('(+) Beneficio Neto del mes (ya reflejado arriba)', (m, isM0)=>isM0 ? null : m.netProfit);
  h+=rowHtml('(+) Devolución IVA CAPEX (Mes 4)', (m, isM0)=>isM0 ? null : (m.ivaRefund ? m.ivaRefund : null));
  if(S.f2Enable) {
    h+=rowHtml('(+/-) Inversión o recuperación neta de stock (Fase 2)', (m, isM0)=>isM0 ? null : (m.f2In - m.f2Out - (m.f2MarginRealized || 0)));
  }
  h+='<tr class="cash"><td>CAJA FINAL ACUMULADA</td>'+cols.map((m, idx) => {
    const val = (m === '0') ? R.cajaIni : ms[idx - 1].fin;
    return '<td style="color:' + (val < 0 ? 'var(--red-soft)' : 'inherit') + '">' + (val < 0 ? '−' : '') + eur(Math.abs(val)) + '</td>';
  }).join('') + '</tr>';

  h+='</tbody>';
  $('#pnlTable').innerHTML=h;
}

/* ---------- tooltips ---------- */
let tipEl;
function showTip(h){
  const r=h.getBoundingClientRect();
  tipEl.innerHTML=h.dataset.help;
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

/* ============ PRESETS CUSTOM (guardar / cargar / borrar) ============ */
const CUSTOM_KEY='manufaktur_porsche_presets';

function snapshotState(){
  const o={};
  Object.keys(S).forEach(k=>o[k]=S[k]);
  o.socioProd=S.socioProd?1:0;
  return o;
}
function applyState(o){
  Object.keys(S).forEach(k=>{if(o[k]!==undefined)S[k]=o[k];});
  if(o.socioProd!==undefined)S.socioProd=!!o.socioProd&&o.socioProd!==0;
  setNs(S.ns);setSocioProd(S.socioProd);setDomEnable(S.domEnable);
  setSimpleToggle('estacionalT','estacional');setSimpleToggle('impuestosT','impuestos');setSimpleToggle('f2EnableT','f2Enable');
  setSimpleToggle('recepEnableT','recepEnable');setSimpleToggle('cpEnableT','cpEnable');
  syncAll();render();
}
function loadCustom(){try{return JSON.parse(localStorage.getItem(CUSTOM_KEY))||{};}catch(e){return {};}}
function saveCustom(obj){try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(obj));}catch(e){}}
function flashMsg(txt){const el=$('#customMsg');if(!el)return;el.textContent=txt;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),3000);}

/* helpers: support both old format (state only) and new ({s, desc}) */
function entryState(e){return (e && e.s) ? e.s : e;}
function entryDesc(e){return (e && e.desc) ? e.desc : '';}

/* render custom presets as buttons next to the fixed ones */
function renderCustomPresets(){
  const host=$('#customPresets');if(!host)return;
  const all=loadCustom();const names=Object.keys(all);
  host.innerHTML=names.map(n=>{const esc=n.replace(/"/g,'&quot;');
    const desc=entryDesc(all[n]);
    const info=desc?`<span class="preset-info help" data-help="${desc.replace(/"/g,'&quot;')}">i</span>`:'';
    return `<button class="preset preset-custom" data-cname="${esc}"><span>${n}</span><small>mío</small>${info}<span class="preset-del" data-del="${esc}" title="Borrar escenario">✕</span></button>`;
  }).join('');
  // load on click (ignore clicks on the info/delete chips)
  $$('#customPresets .preset-custom').forEach(b=>b.addEventListener('click',e=>{
    if(e.target.classList.contains('preset-del')||e.target.classList.contains('preset-info'))return;
    const all=loadCustom();const name=b.dataset.cname;
    if(all[name]){applyState(entryState(all[name]));clearActive();b.classList.add('active');}
  }));
  // delete on ✕
  $$('#customPresets .preset-del').forEach(x=>x.addEventListener('click',e=>{
    e.stopPropagation();
    const name=x.dataset.del;const all=loadCustom();
    if(confirm('¿Borrar el escenario “'+name+'”?')){delete all[name];saveCustom(all);renderCustomPresets();flashMsg('Escenario “'+name+'” borrado.');}
  }));
  // info tooltip (reuse the global tooltip system)
  $$('#customPresets .preset-info').forEach(ic=>{
    ic.addEventListener('click',e=>e.stopPropagation());
    ic.addEventListener('mouseenter',()=>{if(!isTouch)showTip(ic);});
    ic.addEventListener('mouseleave',()=>{if(!isTouch)hideTip();});
    ic.addEventListener('click',e=>{showTip(ic);e.stopPropagation();});
  });
}

/* save current state as a new custom preset */
const saveBtn=$('#saveScenario');
if(saveBtn)saveBtn.onclick=()=>{
  const inp=$('#scenarioName');const name=(inp.value||'').trim();
  const descEl=$('#scenarioDesc');const desc=(descEl&&descEl.value||'').trim();
  if(!name){flashMsg('Escribe un nombre para el escenario.');inp.focus();return;}
  const all=loadCustom();
  const existed=all[name]!==undefined;
  all[name]={s:snapshotState(),desc:desc};saveCustom(all);
  inp.value='';if(descEl)descEl.value='';renderCustomPresets();
  flashMsg(existed?('Escenario “'+name+'” actualizado.'):('Escenario “'+name+'” guardado.'));
};

/* render ayudas/subvenciones como toggles con (i) de requisitos */
function renderAyudas(){
  const host=$('#ayudasList');if(!host)return;
  host.innerHTML=AYUDAS.map(a=>{
    const on=S[a.k]?'on':'';
    let cuantia='';
    if(a.tipo==='capex') cuantia=a.perSocio?('hasta '+eur(a.importe)+'/socio'):('hasta '+eur(a.importe));
    else if(a.tipo==='opex') cuantia='~'+eur(a.ahorroMes)+'/mes·socio';
    else if(a.tipo==='capex_pct') cuantia='% de la inversión';
    else if(a.tipo==='capex_hire') cuantia='5.500-7.500 €/contrato';
    else if(a.tipo==='info') cuantia='aporte de capital';
    return `<div class="ayuda-row ${on?'ayuda-on':''}" data-k="${a.k}">
      <div class="ayuda-main">
        <button class="ayuda-toggle" data-k="${a.k}" role="switch" aria-checked="${S[a.k]?'true':'false'}"><span class="dot"></span></button>
        <div class="ayuda-txt">
          <div class="ayuda-name">${a.nombre} <span class="help" data-help="${a.help.replace(/"/g,'&quot;')}">i</span></div>
          <div class="ayuda-meta"><span class="ayuda-nivel">${a.nivel}</span> · ${cuantia}</div>
        </div>
      </div>
    </div>`;
  }).join('');
  $$('#ayudasList .ayuda-toggle').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.k;S[k]=S[k]?0:1;clearActive();renderAyudas();render();
  }));
  // re-bind help tooltips for the new (i) icons
  $$('#ayudasList .help').forEach(ic=>{
    ic.addEventListener('mouseenter',()=>{if(!isTouch)showTip(ic);});
    ic.addEventListener('mouseleave',()=>{if(!isTouch)hideTip();});
    ic.addEventListener('click',e=>{showTip(ic);e.stopPropagation();});
  });
}

/* ============ RADAR DE RIESGOS (premortem) ============ */
function computeRisks(R){
  const risks=[];
  // 1. dependencia de ayudas: ¿el plan solo vive si llegan las subvenciones?
  const anyAyuda=AYUDAS.some(a=>S[a.k]);
  if(anyAyuda){
    const saved={};AYUDAS.forEach(a=>{saved[a.k]=S[a.k];S[a.k]=0;});
    const R0=compute();
    AYUDAS.forEach(a=>{S[a.k]=saved[a.k];});
    if(!R.insolv && R0.insolv) risks.push({sev:'alta',t:'Dependencia de ayudas',
      d:`Sin subvenciones, el plan quiebra en el mes ${R0.insolv}. Las ayudas se cobran tarde o se deniegan: deben ser colchón, no estructura. No cuentes con ellas hasta tenerlas concedidas por escrito.`});
  }
  // 2. insolvencia directa
  if(R.insolv) risks.push({sev:'alta',t:'Insolvencia proyectada',
    d:`La caja se agota en el mes ${R.insolv}. Antes de seguir, toca recortar sueldos, reducir CAPEX o subir productividad.`});
  // 3. rampa
  if(!R.insolv){
    if(!R.be) risks.push({sev:'alta',t:'Sin break-even en el horizonte',
      d:`En ${S.horizon} meses ningún mes llega a beneficio: el negocio compra tiempo con el colchón, no rentabilidad.`});
    else if(R.be>9) risks.push({sev:'media',t:'Rampa lenta (premortem #1)',
      d:`Break-even en el mes ${R.be}. La causa de muerte más probable del plan: cada mes de retraso extra sobre lo previsto consume colchón que no vuelve. Señal de alarma real: agenda ocupada por debajo del 50% en el mes 3.`});
  }
  // 4. colchón final frágil
  const lastOpex=R.months[R.months.length-1].opex;
  if(!R.insolv && R.cajaFin < 3*lastOpex) risks.push({sev:'media',t:'Colchón final frágil',
    d:`Cierras el periodo con ${eur(R.cajaFin)}: menos de 3 meses de gastos (${eur(lastOpex)}/mes). Un imprevisto serio (avería del elevador, impago, mes flojo) te deja sin margen.`});
  // 5. punto único de fallo
  if(R.months[0].producers<=1) risks.push({sev:'media',t:'Punto único de fallo (premortem #2)',
    d:'Solo una persona produce: el jefe de mecánicos. Si se va, se lesiona o no aparece el candidato, la facturación cae a cero con tres sueldos corriendo. Mitiga: incentivos de permanencia, procesos documentados, plan B identificado.'});
  // 6. sobreinversión estética
  const estetica=S.cx_obra+S.cx_mob+S.cx_rotulo;
  const cxT=capexTotal();
  if(cxT>0 && estetica>0.45*cxT) risks.push({sev:'media',t:'Sobreinversión estética (premortem #8)',
    d:`Obra + mobiliario + branding suman ${eur(estetica)} (${Math.round(estetica/cxT*100)}% del CAPEX). La boutique se construye por fases: digna al abrir, lujo con la caja generada — no antes de tener clientes recurrentes.`});
  // 7. tarifa de miedo
  if(S.tar<90) risks.push({sev:'baja',t:'Tarifa de miedo (premortem #6)',
    d:`A ${eur(S.tar)}/h estás por debajo del suelo razonable de un especialista en Madrid (90-95 €). Entrar barato "para captar" impide subir después sin perder a los clientes captados. El PPI y el domicilio justifican precio, no descuento.`});
  // 8. compraventa prematura (premortem #5)
  if(S.f2Enable){
    if(!R.be) risks.push({sev:'alta',t:'Compraventa prematura (premortem #5)',
      d:'Has activado la Fase 2 pero el taller ni siquiera alcanza break-even. Cada coche congela '+eur(S.f2Capital)+' que necesitas para nóminas. Regla de oro: ni un euro a stock hasta 3 meses seguidos de caja positiva.'});
    else if(S.f2MesInicio <= R.be+2) risks.push({sev:'alta',t:'Compraventa prematura (premortem #5)',
      d:`Primer coche en el mes ${S.f2MesInicio} con break-even en el mes ${R.be}: demasiado pronto. Cada unidad congela ${eur(S.f2Capital)} durante ${S.f2CicloMeses} meses. Retrasa el inicio al menos al mes ${R.be+3}.`});
  }
  // 9. garantía sin provisión
  if(S.garantiaPct===0) risks.push({sev:'baja',t:'Garantía sin provisionar',
    d:'Vuestro plan incluye garantía de 1 año sin seguro, pero no estáis apartando nada para cubrirla. Un retrabajo serio (motor, caja) sale de caja sin aviso. Provisión razonable: 2-3% de la facturación.'});
  // 10. caja inicial imposible
  if(R.cajaIni<0) risks.push({sev:'alta',t:'Configuración imposible',
    d:'El CAPEX supera el capital disponible. Nada de lo demás importa hasta resolver esto.'});
  return risks;
}

function renderRisks(R){
  const host=$('#riskList');if(!host)return;
  const risks=computeRisks(R);
  if(!risks.length){
    host.innerHTML='<div class="risk-ok">✓ Ninguna señal del premortem activa con esta configuración. Quedan los riesgos humanos de abajo — esos no los apaga ningún slider.</div>';
    return;
  }
  const order={alta:0,media:1,baja:2};
  risks.sort((a,b)=>order[a.sev]-order[b.sev]);
  host.innerHTML=risks.map(r=>`<div class="risk-item ${r.sev}">
    <span class="sev">${r.sev}</span>
    <div><div class="rt">${r.t}</div><div class="rd">${r.d}</div></div>
  </div>`).join('');
}

/* ============ EXPORTACIÓN A MARKDOWN ============ */
function exportMarkdown(){
  const R=compute();
  const hoy=new Date().toLocaleDateString('es-ES',{year:'numeric',month:'long',day:'numeric'});
  let md=`# Manufaktur Porsche · Simulación financiera\n\n`;
  md+=`Generado: ${hoy} · Horizonte: ${S.horizon} meses\n\n`;
  md+=`## Resultado\n\n`;
  md+=`| Indicador | Valor |\n|---|---|\n`;
  md+=`| Estado | ${R.insolv?('Se queda sin caja en el mes '+R.insolv):'Sobrevive todo el periodo'} |\n`;
  md+=`| Break-even | ${R.be?('Mes '+R.be):'No se alcanza'} |\n`;
  md+=`| Caja final (mes ${S.horizon}) | ${eur(R.cajaFin)} |\n`;
  md+=`| Mejor resultado mensual | ${eur(R.best)} |\n`;
  md+=`| Horas de equilibrio | ${Math.round(R.beH)} h/mes |\n`;
  md+=`| Caja inicial tras CAPEX | ${eur(R.cajaIni)} |\n\n`;
  
  md+=`## Parámetros de la Simulación\n\n`;
  const groupedVars={};
  document.querySelectorAll('[data-f]').forEach(d=>{
    const f=d.dataset.f;if(S[f]===undefined)return;
    const acc=d.closest('.acc');
    const sectionName=acc?acc.querySelector('summary').textContent.trim():'Otros Parámetros';
    if(!groupedVars[sectionName])groupedVars[sectionName]=[];
    groupedVars[sectionName].push(d);
  });
  
  for(const section in groupedVars){
    md+=`### ${section}\n\n`;
    md+=`| Parámetro | Valor | Descripción |\n`;
    md+=`|---|---|---|\n`;
    groupedVars[section].forEach(d=>{
      const f=d.dataset.f;
      const u=d.dataset.unit||'';
      const v=S[f];
      let displayVal='';
      if(u==='%'){
        displayVal=(v*100).toFixed(2).replace(/\.?0+$/,'')+'%';
      }else if(u==='€'){
        displayVal=eur(v);
      }else if(u==='€/h'){
        displayVal=eur(v)+'/h';
      }else if(u==='€/m²'){
        displayVal=v+' €/m²';
      }else if(u==='m'){
        displayVal=v+' meses';
      }else if(u==='x'){
        displayVal=v+'x';
      }else{
        displayVal=v+(u?' '+u:'');
      }
      const desc=d.querySelector('.help')?.getAttribute('data-help')||(HELP[f]||'');
      md+=`| ${d.dataset.label} | ${displayVal} | ${desc} |\n`;
    });
    md+=`\n`;
  }

  md+=`## Configuración de Módulos y Toggles\n\n`;
  md+=`| Módulo / Opción | Estado | Configuración |\n`;
  md+=`|---|---|---|\n`;
  md+=`| Socios a sueldo | ${S.ns} socios | - |\n`;
  md+=`| Socios que producen | ${S.socioProd?'Sí':'No'} | ${S.socioProd?`${S.nsProd} socios productores (${Math.round(S.socioProdPct*100)}% jornada)`:'-'} |\n`;
  md+=`| Recepcionista | ${S.recepEnable?'Activo':'Inactivo'} | ${S.recepEnable?`Desde mes ${S.recepMes} (${eur(S.recepSal)}/mes)`:'-'} |\n`;
  md+=`| Chapa y pintura | ${S.cpEnable?'Activo':'Inactivo'} | ${S.cpEnable?`Desde mes ${S.cpMes} (Facturación: ${eur(S.cpIngresoMes)}/mes, Responsable: ${eur(S.cpResponsableSal)}/mes, Material: ${eur(S.cpMaterialMes)}/mes)`:'-'} |\n`;
  md+=`| Diagnóstico a domicilio | ${S.domEnable?'Activo':'Inactivo'} | ${S.domEnable?`Desde mes ${S.domMes} (${S.domVisitsM} visitas/mes, Tarifa: ${eur(S.domFee)}, Coche renting: ${eur(S.domVehLease)}/mes)`:'-'} |\n`;
  md+=`| Estacionalidad (Madrid) | ${S.estacional?'Activa':'Inactiva'} | - |\n`;
  md+=`| Impuesto de Sociedades | ${S.impuestos?'Activo (25%)':'Inactivo (0%)'} | - |\n`;
  md+=`| Fase 2 Compraventa | ${S.f2Enable?'Activa':'Inactiva'} | ${S.f2Enable?`Desde mes ${S.f2MesInicio} (${S.f2CochesMes} coches/mes, Capital: ${eur(S.f2Capital)}, Margen: ${eur(S.f2Margen)}, Taller: ${S.f2Horas}h/coche)`:'-'} |\n\n`;

  md+=`## Inversiones Iniciales Manuales (Detalle)\n\n`;
  md+=`| Partida | Cantidad | Precio Unit. | Total |\n`;
  md+=`|---|---|---|---|\n`;
  const manualItems=[
    ['cx_obra','Obra y adaptación'],
    ['cx_fianza','Fianza del local'],
    ['cx_licencia','Licencia + proyecto técnico'],
    ['cx_rotulo','Rótulo y branding'],
    ['cx_stock','Stock inicial consumibles']
  ];
  manualItems.forEach(([f,label])=>{
    const qty=S[f+'_qty']!==undefined?S[f+'_qty']:1;
    const price=S[f+'_price']!==undefined?S[f+'_price']:(S[f]||0);
    const total=qty*price;
    md+=`| ${label} | ${qty} ud${qty!==1?'s':''} | ${eur(price)} | ${eur(total)} |\n`;
  });
  md+=`\n`;

  if(catalog){
    md+=`## Equipamiento y Maquinaria (Detalle)\n\n`;
    for(const catKey in catalog){
      const cat=catalog[catKey];
      md+=`### ${cat.titulo}\n\n`;
      md+=`| Elemento | Opción Seleccionada | Cantidad | Precio Unit. | Total | Tipo Adquisición |\n`;
      md+=`|---|---|---|---|---|---|\n`;
      cat.items.forEach((item,idx)=>{
        if(item.nombre.startsWith("RECOMENDACION"))return;
        const itemKey=`${catKey}_${idx}`;
        const opt=S[itemKey+'_opt']||'';
        const qty=S[itemKey+'_qty']||0;
        const price=S[itemKey+'_price']||0;
        const total=qty*price;
        const isLeased=S[itemKey+'_lease']||false;
        
        let optText='Ninguna';
        if(opt){
          const optObj=item.opciones.find(o=>o.letra===opt);
          optText=optObj?`Opción ${opt} (${optObj.modelo||optObj.proveedor||''})`:`Opción ${opt}`;
        }
        
        let acquisitionText='Compra directa';
        if(isLeased && qty>0){
          const leaseTerm=S[itemKey+'_leaseTerm']||60;
          const leaseRate=S[itemKey+'_leaseRate']!==undefined?S[itemKey+'_leaseRate']:0.07;
          acquisitionText=`Leasing (${leaseTerm} meses, ${(leaseRate*100).toFixed(2).replace(/\.?0+$/,'')}% interés)`;
        }
        
        md+=`| ${item.nombre} | ${optText} | ${qty} ud${qty!==1?'s':''} | ${eur(price)} | ${eur(total)} | ${acquisitionText} |\n`;
      });
      md+=`\n`;
    }
  }

  md+=`## Ayudas y Subvenciones (Madrid 2026)\n\n`;
  md+=`| Ayuda | Ámbito | Estado | Tipo / Detalle |\n`;
  md+=`|---|---|---|---|\n`;
  AYUDAS.forEach(a=>{
    const isAct=!!S[a.k];
    const statusText=isAct?'**Activa**':'Inactiva';
    let detail='';
    if(a.tipo==='opex')detail=`${a.ahorroMes} €/mes de ahorro`;
    else if(a.tipo==='capex')detail=`${a.importe} € de subvención inicial`;
    else if(a.tipo==='capex_pct')detail=`${Math.round(a.pctInversion*100)}% de la inversión (a los 3 años)`;
    else if(a.tipo==='capex_hire')detail=`${a.importe} € por contratación indefinida`;
    else detail='Aporte informativo / capital';
    md+=`| ${a.nombre} | ${a.nivel} | ${statusText} | ${detail} |\n`;
  });
  md+=`\n`;

  md+=`## Radar de riesgos (premortem)\n\n`;
  const risks=computeRisks(R);
  md+=risks.length?risks.map(r=>`- **[${r.sev.toUpperCase()}] ${r.t}:** ${r.d}`).join('\n')+'\n\n':'Sin señales activas.\n\n';
  
  md+=`## Tesorería mes a mes\n\n| Mes | Horas fact. | Facturación | Bº Bruto | OPEX | Bº Neto | Caja fin |\n|---|---|---|---|---|---|---|\n`;
  R.months.forEach(m=>{md+=`| ${m.m} | ${m.h} | ${eur(m.facturacion)} | ${eur(m.beneficioBruto)} | ${eur(m.opex - (m.cpMaterial||0))} | ${eur(m.netProfit)} | ${eur(m.fin)} |\n`;});
  md+=`\n---\n*Modelo orientativo · datos de mercado Madrid 2026 · verificar ayudas en BOCM/SEPE antes de contar con ellas.*\n`;
  
  // download
  const blob=new Blob([md],{type:'text/markdown;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='manufaktur-simulacion.md';document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
  // copy too
  if(navigator.clipboard)navigator.clipboard.writeText(md).catch(()=>{});
  flashMsg('Simulación exportada (.md descargado y copiado al portapapeles).');
}
const expBtn=document.getElementById('exportMd');
if(expBtn)expBtn.addEventListener('click',exportMarkdown);

/* ============ PULSO DE KPIs ============ */
const _kpiPrev={};
function pulseKpis(){
  ['v_solv','v_caja','v_res','v_be'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    const v=el.textContent;
    if(_kpiPrev[id]!==undefined && _kpiPrev[id]!==v){
      el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');
    }
    _kpiPrev[id]=v;
  });
}


/* ============ CUENTA DE RESULTADOS (tabla mensual) ============ */
function renderPnl(R){
  drawPnL(R);
}

/* ============ TOGGLES SIMPLES NUEVOS ============ */
bindSimpleToggle('recepEnableT','recepEnable');
bindSimpleToggle('cpEnableT','cpEnable');

function bindLayerToggles(){
  $$('.layer-toggle').forEach(el=>{
    el.addEventListener('click',e=>{
      e.preventDefault();
      const type=el.id.replace('toggle_','');
      chartLayers[type]=!chartLayers[type];
      el.classList.toggle('active',chartLayers[type]);
      const inp=el.querySelector('input');
      if(inp)inp.checked=chartLayers[type];
      render();
    });
  });
}

/* ============ BUSCADOR DE VARIABLES ============ */
const ctrlSearch=$('#ctrlSearch');
if(ctrlSearch) ctrlSearch.addEventListener('input',e=>{
  const q=e.target.value.trim().toLowerCase();
  $$('#controls .acc').forEach(acc=>{
    const labels=[...acc.querySelectorAll('.lab, summary')].map(x=>x.textContent.toLowerCase()).join(' ');
    const sumTxt=acc.querySelector('summary').textContent.toLowerCase();
    const match=!q||labels.includes(q)||sumTxt.includes(q);
    acc.style.display=match?'':'none';
    if(q&&match&&!sumTxt.includes(q)){
      // resaltar campos coincidentes
      acc.open=true;
      acc.querySelectorAll('.field').forEach(fl=>{
        fl.style.display=fl.textContent.toLowerCase().includes(q)?'':'none';
      });
    } else {
      acc.querySelectorAll('.field').forEach(fl=>fl.style.display='');
    }
  });
  // ocultar cabeceras de grupo sin acordeones visibles
  $$('#controls .acc-group').forEach(g=>{
    let n=g.nextElementSibling, vis=false;
    while(n&&n.classList.contains('acc')){if(n.style.display!=='none'){vis=true;break;}n=n.nextElementSibling;}
    g.style.display=(!q||vis)?'':'none';
  });
});

/* ============ COLAPSAR / EXPANDIR TODO ============ */
const collapseBtn=$('#collapseAll');
if(collapseBtn) collapseBtn.addEventListener('click',()=>{
  const anyOpen=$$('#controls .acc').some(a=>a.open);
  $$('#controls .acc').forEach(a=>a.open=!anyOpen);
  collapseBtn.textContent='⇕';
  collapseBtn.title=anyOpen?'Expandir todo':'Colapsar todo';
});

/* ============ COMPARTIR ESCENARIO POR ENLACE ============ */
function encodeState(o){try{return btoa(unescape(encodeURIComponent(JSON.stringify(o))));}catch(e){return '';}}
function decodeState(s){try{return JSON.parse(decodeURIComponent(escape(atob(s))));}catch(e){return null;}}
const shareBtn=$('#shareScenario');
if(shareBtn) shareBtn.addEventListener('click',()=>{
  const snap=snapshotState();
  const code=encodeState(snap);
  const url=location.origin+location.pathname+'#cfg='+code;
  if(navigator.clipboard) navigator.clipboard.writeText(url).then(
    ()=>flashMsg('¡Enlace copiado! Quien lo abra verá este escenario exacto.'),
    ()=>prompt('Copia este enlace:',url));
  else prompt('Copia este enlace:',url);
});
function loadFromURL(){
  const m=location.hash.match(/cfg=([^&]+)/);if(!m)return false;
  const data=decodeState(m[1]);if(!data)return false;
  applyState(data);clearActive();flashMsg('Escenario cargado desde el enlace compartido.');
  return true;
}

/* ============ CONFIGURADOR VISTA AVANZADA ============ */
let activeModalCategory = 'cx_elev';

function openAdvancedModal() {
  const modal = $('#cxAdvancedModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderAdvancedConfigurator();
}

function closeAdvancedModal() {
  const modal = $('#cxAdvancedModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  syncAll();
  render();
}

function initAdvancedModalListeners() {
  const openBtn = $('#btnOpenAdvancedCapex');
  const closeBtn = $('#btnCloseAdvancedCapex');
  const applyBtn = $('#btnApplyAdvancedCapex');
  const modalOverlay = $('#cxAdvancedModal');
  
  if (openBtn) openBtn.addEventListener('click', openAdvancedModal);
  if (closeBtn) closeBtn.addEventListener('click', closeAdvancedModal);
  if (applyBtn) applyBtn.addEventListener('click', closeAdvancedModal);
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeAdvancedModal();
      }
    });
  }
}

function syncModalTotals() {
  recalculateCatalogTotals();
  
  let equipSum = 0;
  if (catalog) {
    for (const catKey in catalog) {
      equipSum += S[catKey] || 0;
    }
  }
  
  const capTotal = capexTotal();
  
  const equipEl = $('#cxModalEquipTotal');
  const capEl = $('#cxModalCapexTotal');
  
  if (equipEl) equipEl.textContent = eur(equipSum);
  if (capEl) capEl.textContent = eur(capTotal);
}

function renderAdvancedConfigurator() {
  const sidebarEl = $('#cxModalSidebar');
  const contentEl = $('#cxModalContent');
  
  if (!sidebarEl || !contentEl || !catalog) return;
  
  // 1. Render sidebar categories
  let sidebarHtml = '';
  for (const catKey in catalog) {
    const cat = catalog[catKey];
    const catTotal = S[catKey] || 0;
    const isActive = catKey === activeModalCategory;
    
    let activeCount = 0;
    cat.items.forEach((item, idx) => {
      if (item.nombre.startsWith("RECOMENDACION")) return;
      const itemKey = `${catKey}_${idx}`;
      if (S[itemKey + '_opt'] !== '' && (S[itemKey + '_qty'] || 0) > 0) {
        activeCount++;
      }
    });
    
    sidebarHtml += `
      <button class="cx-sidebar-cat-btn ${isActive ? 'active' : ''}" data-cat="${catKey}">
        <span class="cat-title">
          <span>${cat.titulo}</span>
          ${activeCount > 0 ? `<span class="badge badge-mandatory" style="font-size:10px; padding:1px 5px; border-radius:10px; background:rgba(203,164,94,0.15); color:var(--gold-soft); border:1px solid rgba(203,164,94,0.3);">${activeCount}</span>` : ''}
        </span>
        <span class="cat-price">${eur(catTotal)}</span>
      </button>
    `;
  }
  sidebarEl.innerHTML = sidebarHtml;
  
  $$('.cx-sidebar-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeModalCategory = btn.dataset.cat;
      renderAdvancedConfigurator();
    });
  });
  
  // 2. Render category content
  const activeCat = catalog[activeModalCategory];
  let contentHtml = '';
  
  contentHtml += `
    <div style="margin-bottom: 8px;">
      <h3 style="font-family:'Fraunces', serif; font-style:italic; font-size:20px; color:var(--gold-soft); font-weight:500;">
        ${activeCat.titulo}
      </h3>
      <p style="font-size:13px; color:var(--mut); margin-top:2px;">
        Selecciona las opciones deseadas y ajusta las unidades de cada equipo. Las modificaciones se aplican en tiempo real.
      </p>
    </div>
  `;
  
  activeCat.items.forEach((item, idx) => {
    if (item.nombre.startsWith("RECOMENDACION")) return;
    const itemKey = `${activeModalCategory}_${idx}`;
    const selectedOpt = S[itemKey + '_opt'] || '';
    const qtyVal = S[itemKey + '_qty'] !== undefined ? S[itemKey + '_qty'] : 0;
    
    const isMandatory = item.prioridad === 'Esencial';
    const badgeClass = isMandatory ? 'badge-mandatory' : 'badge-suggested';
    const badgeText = isMandatory ? 'Obligatorio' : 'Sugerencia';
    const itemHelp = item.descripcion || item.notas || '';
    
    let optionsHtml = '';
    item.opciones.forEach(opt => {
      const isSelected = selectedOpt === opt.letra;
      const cardClass = isSelected ? 'selected' : '';
      
      let specsTable = '';
      if (opt.proveedor || opt.capacidad || opt.voltaje || opt.instalacion || opt.plazo) {
        specsTable += `<table class="cx-opt-specs-table">`;
        if (opt.proveedor) specsTable += `<tr><td class="label">Proveedor:</td><td class="value">${opt.proveedor}</td></tr>`;
        if (opt.capacidad) specsTable += `<tr><td class="label">Capacidad:</td><td class="value">${opt.capacidad}</td></tr>`;
        if (opt.voltaje) specsTable += `<tr><td class="label">Alimentación:</td><td class="value">${opt.voltaje}</td></tr>`;
        if (opt.instalacion) specsTable += `<tr><td class="label">Instalación:</td><td class="value">${opt.instalacion}</td></tr>`;
        if (opt.plazo) specsTable += `<tr><td class="label">Plazo:</td><td class="value">${opt.plazo}</td></tr>`;
        specsTable += `</table>`;
      }
      
      const assessmentHtml = opt.valoracion ? `
        <div class="cx-opt-assessment ${isSelected ? 'cx-opt-assessment-gold' : ''}">
          ${opt.valoracion}
        </div>
      ` : '';
      
      const linkUrl = getProductLink(opt, item);
      const sourceLinkHtml = `
        <a href="${linkUrl}" target="_blank" class="cx-opt-link">🔗 Ver ficha del producto &rarr;</a>
      `;
      
      let qtySelectorHtml = '';
      if (isSelected) {
        qtySelectorHtml = `
          <div class="cx-opt-qty-selector" onclick="event.stopPropagation();">
            <button class="cx-opt-qty-btn cx-qty-dec" data-itemkey="${itemKey}">-</button>
            <span class="cx-opt-qty-val">${qtyVal}</span>
            <button class="cx-opt-qty-btn cx-qty-inc" data-itemkey="${itemKey}">+</button>
            <span style="font-size:10px; color:var(--mut);">Uds</span>
          </div>
        `;
      }
      
      optionsHtml += `
        <div class="cx-option-card ${cardClass}" data-itemkey="${itemKey}" data-opt="${opt.letra}">
          <span class="cx-opt-badge-selected">✓ Seleccionado</span>
          <div class="cx-opt-letter-title">Opción ${opt.letra}</div>
          <div class="cx-opt-model">${opt.modelo}</div>
          ${specsTable}
          ${assessmentHtml}
          <div class="cx-opt-price-row">
            <span class="cx-opt-price-label">Precio Unitario</span>
            <span class="cx-opt-price-val">${eur(opt.precio)}</span>
          </div>
          ${sourceLinkHtml}
          ${isSelected ? qtySelectorHtml : `<button class="cx-opt-select-btn" data-itemkey="${itemKey}" data-opt="${opt.letra}">Seleccionar</button>`}
        </div>
      `;
    });
    
    const isNoneSelected = selectedOpt === '';
    optionsHtml += `
      <div class="cx-option-card ${isNoneSelected ? 'selected' : ''}" data-itemkey="${itemKey}" data-opt="">
        <span class="cx-opt-badge-selected">✓ Ninguno</span>
        <div class="cx-opt-letter-title">Excluir equipo</div>
        <div class="cx-opt-model" style="color:var(--mut); font-weight:normal; font-style:italic;">No adquirir esta herramienta</div>
        <p style="font-size:11.5px; color:var(--mut2); margin-bottom:16px; line-height:1.4;">
          Elimina este equipamiento de la inversión inicial. Utilizar sólo si no es indispensable o si ya se dispone de él.
        </p>
        <div class="cx-opt-price-row">
          <span class="cx-opt-price-label">Precio</span>
          <span class="cx-opt-price-val">0 €</span>
        </div>
        ${isNoneSelected ? '' : `<button class="cx-opt-select-btn" data-itemkey="${itemKey}" data-opt="">Desactivar</button>`}
      </div>
    `;
    
    let leaseSettingsHtml = '';
    if (selectedOpt !== '') {
      const isLeased = S[itemKey + '_lease'] || false;
      const leaseTerm = S[itemKey + '_leaseTerm'] || 60;
      const leaseRate = S[itemKey + '_leaseRate'] !== undefined ? S[itemKey + '_leaseRate'] : 0.07;
      
      leaseSettingsHtml = `
        <div class="cx-item-lease-panel" style="margin-top: 12px; padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 12px;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none;">
            <input type="checkbox" class="cx-lease-chk" id="cxlease_${itemKey}" ${isLeased ? 'checked' : ''} style="accent-color: var(--gold);">
            <span>Adquirir vía leasing (financiación con proveedor)</span>
          </label>
          ${isLeased ? `
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: var(--mut);">Plazo:</span>
                <input type="number" class="cx-lease-term-inp" id="cxleaseterm_${itemKey}" value="${leaseTerm}" min="12" max="120" step="6" style="width: 50px; text-align: center; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: var(--ink); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 2px;">
                <span style="color: var(--mut);">meses</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: var(--mut);">Interés:</span>
                <input type="number" class="cx-lease-rate-inp" id="cxleaserate_${itemKey}" value="${Math.round(leaseRate * 1000) / 10}" min="0" max="30" step="0.5" style="width: 50px; text-align: center; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: var(--ink); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 2px;">
                <span style="color: var(--mut);">% anual</span>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    contentHtml += `
      <div class="cx-item-config-block" id="cxblock_${itemKey}">
        <div class="cx-item-config-header">
          <div>
            <div class="cx-item-config-title">
              <span>${item.nombre}</span>
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            ${itemHelp ? `<div class="cx-item-config-desc">${itemHelp}</div>` : ''}
          </div>
          <div style="text-align: right; display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
            <span style="font-size:11px; color:var(--mut);">Subtotal</span>
            <span class="cx-item-price-val" style="font-size:15px; font-weight:600;" id="cxvalmodal_${itemKey}">
              ${eur(qtyVal * (S[itemKey + '_price'] || 0))}
            </span>
          </div>
        </div>
        <div class="cx-options-grid">
          ${optionsHtml}
        </div>
        ${leaseSettingsHtml}
      </div>
    `;
  });
  
  contentEl.innerHTML = contentHtml;
  syncModalTotals();
  
  $$('.cx-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const itemKey = card.dataset.itemkey;
      const opt = card.dataset.opt;
      selectOptionInModal(itemKey, opt);
    });
  });
  
  $$('.cx-qty-dec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemKey = btn.dataset.itemkey;
      adjustQtyInModal(itemKey, -1);
    });
  });
  
  $$('.cx-qty-inc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemKey = btn.dataset.itemkey;
      adjustQtyInModal(itemKey, 1);
    });
  });
  
  // lease checkbox change
  $$('.cx-lease-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const itemKey = chk.id.replace('cxlease_', '');
      S[itemKey + '_lease'] = chk.checked;
      recalculateCatalogTotals();
      renderAdvancedConfigurator();
      syncAll();
      render();
    });
  });
  
  // lease term change
  $$('.cx-lease-term-inp').forEach(inp => {
    const updateTerm = () => {
      const itemKey = inp.id.replace('cxleaseterm_', '');
      S[itemKey + '_leaseTerm'] = Math.max(12, parseInt(inp.value) || 60);
      recalculateCatalogTotals();
      render();
    };
    inp.addEventListener('change', updateTerm);
    inp.addEventListener('input', updateTerm);
  });

  // lease rate change
  $$('.cx-lease-rate-inp').forEach(inp => {
    const updateRate = () => {
      const itemKey = inp.id.replace('cxleaserate_', '');
      const pct = parseFloat(inp.value) || 0;
      S[itemKey + '_leaseRate'] = Math.max(0, pct / 100);
      recalculateCatalogTotals();
      render();
    };
    inp.addEventListener('change', updateRate);
    inp.addEventListener('input', updateRate);
  });
}

function selectOptionInModal(itemKey, opt) {
  const parts = itemKey.split('_');
  const itemIdx = parseInt(parts.pop());
  const catKey = parts.join('_');
  const item = catalog[catKey].items[itemIdx];
  
  S[itemKey + '_opt'] = opt;
  if (opt === '') {
    S[itemKey + '_qty'] = 0;
    S[itemKey + '_price'] = 0;
    S[itemKey + '_lease'] = false;
  } else {
    if ((S[itemKey + '_qty'] || 0) <= 0) {
      S[itemKey + '_qty'] = 1;
    }
    const optObj = item.opciones.find(o => o.letra === opt);
    S[itemKey + '_price'] = optObj ? optObj.precio : 0;
  }
  
  syncAll();
  render();
  renderAdvancedConfigurator();
}

function adjustQtyInModal(itemKey, diff) {
  let qty = (S[itemKey + '_qty'] || 0) + diff;
  if (qty <= 0) {
    qty = 0;
    S[itemKey + '_opt'] = '';
    S[itemKey + '_price'] = 0;
    S[itemKey + '_lease'] = false;
  }
  S[itemKey + '_qty'] = qty;
  
  syncAll();
  render();
  renderAdvancedConfigurator();
}

function initChartYControls() {
  const yMinEl = document.getElementById('chartYMin');
  const yMaxEl = document.getElementById('chartYMax');
  const btnReset = document.getElementById('btnResetChartY');
  
  const onChange = () => {
    render();
  };
  
  if (yMinEl) {
    yMinEl.addEventListener('input', onChange);
    yMinEl.addEventListener('change', onChange);
  }
  if (yMaxEl) {
    yMaxEl.addEventListener('input', onChange);
    yMaxEl.addEventListener('change', onChange);
  }
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (yMinEl) yMinEl.value = '';
      if (yMaxEl) yMaxEl.value = '';
      render();
    });
  }
}

/* init */
let catalog = null;

async function initApp() {
  try {
    const res = await fetch('./data/equipment_catalog.json?v=21');
    catalog = await res.json();
    
    initCatalogState();
    renderCatalogUI();
    initAdvancedModalListeners();
    
    initTips();
    initChartYControls();
    setSocioProd(false);
    setDomEnable(S.domEnable);
    setSimpleToggle('estacionalT','estacional');
    setSimpleToggle('impuestosT','impuestos');
    setSimpleToggle('f2EnableT','f2Enable');
    setSimpleToggle('recepEnableT','recepEnable');
    setSimpleToggle('cpEnableT','cpEnable');
    bindLayerToggles();
    renderCustomPresets();
    renderAyudas();
    
    const _fromURL = loadFromURL();
    if (!_fromURL) {
      document.querySelector('.preset[data-p="ppn"]').classList.add('active');
      Object.assign(S, presets['ppn']);
      applyCatalogPreset('ppn');
    }
    setSocioProd(S.socioProd);
    setSimpleToggle('recepEnableT','recepEnable');
    
    syncAll();
    render();
  } catch (err) {
    console.error("Error loading equipment catalog:", err);
  }
}

initApp();
