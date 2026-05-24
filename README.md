# Atelier Porsche · Simulador de Viabilidad (PWA)

Simulador financiero interactivo para un taller boutique especialista Porsche en Madrid.
Mueve todas las variables del negocio y observa, al instante, la curva de tesorería a 12 meses,
el mes de insolvencia y el punto de equilibrio. Web app instalable (PWA), funciona offline.

## Contenido
```
index.html              · página única (hero parallax + simulador + fases)
js/app.js               · modelo financiero + interacción
manifest.webmanifest    · metadatos PWA
sw.js                   · service worker (offline)
icons/                  · iconos de la app
.nojekyll               · evita el procesado Jekyll en GitHub Pages
```

## Publicarlo gratis en GitHub Pages (≈ 2 min)

### Opción A — Sin tocar la terminal (recomendada)
1. Entra en https://github.com y crea un repositorio nuevo (botón **New**). Ponle un nombre, p. ej. `atelier-porsche`. Marca **Public**.
2. En la página del repo vacío pulsa **"uploading an existing file"**.
3. Arrastra **todo el contenido de esta carpeta** (incluida la carpeta `icons/` y `js/`). Pulsa **Commit changes**.
4. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
5. En 1-2 minutos tu app estará en `https://TU-USUARIO.github.io/atelier-porsche/`.
   Ábrela en el móvil → menú del navegador → **"Añadir a pantalla de inicio"** para instalarla.

### Opción B — Con Git (terminal)
```bash
git init
git add .
git commit -m "Atelier Porsche simulator (PWA)"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/atelier-porsche.git
git push -u origin main
```
Luego activa **Settings → Pages** como en la Opción A.

> La PWA (instalación y modo offline) solo funciona servida por HTTPS — GitHub Pages lo da automáticamente.
> Abriendo `index.html` con doble clic funciona el simulador, pero no la instalación ni el offline.

## Aviso
Modelo orientativo basado en datos de mercado de Madrid 2026. No constituye asesoramiento
financiero, fiscal ni legal; valida las cifras con un profesional antes de comprometer capital.
