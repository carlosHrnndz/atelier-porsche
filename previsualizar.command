#!/bin/bash
# Previsualización local de Atelier Porsche.
# Doble clic en este archivo: levanta un servidor local y abre el navegador.
# Para parar: cierra esta ventana de Terminal (o pulsa Ctrl+C).

cd "$(dirname "$0")" || exit 1
PORT=8000

echo "──────────────────────────────────────────────"
echo "  Atelier Porsche · previsualización local"
echo "  Sirviendo en: http://localhost:$PORT"
echo "  (Cierra esta ventana para detenerlo)"
echo "──────────────────────────────────────────────"

# Abre el navegador en cuanto el servidor esté listo
( sleep 1; open "http://localhost:$PORT/index.html" ) &

# Python 3 trae un servidor http integrado; no instala nada
python3 -m http.server "$PORT"
