# 🎲 ¿Qué hacemos hoy? — Decisor Aleatorio

Una app para cuando no sabes qué hacer. Agrega tus opciones y deja que el destino decida.

---

## Requisitos

Antes de correr la app, necesitas tener instalado:

- **Node.js** (versión 16 o superior)
  → Descárgalo en: https://nodejs.org (elige la versión LTS)

Para verificar que ya lo tienes, abre tu terminal y escribe:
```
node --version
npm --version
```
Si ves números de versión, ya estás listo.

---

## Cómo correr la app

### Paso 1 — Abre tu terminal
- **Windows**: Busca "cmd" o "PowerShell" en el menú inicio
- **Mac**: Abre "Terminal" desde Aplicaciones → Utilidades

### Paso 2 — Ve a la carpeta del proyecto
```bash
cd decisor-app
```

### Paso 3 — Instala las dependencias (solo la primera vez)
```bash
npm install
```
Esto puede tardar 1-2 minutos. Solo necesitas hacerlo una vez.

### Paso 4 — Corre la app
```bash
npm start
```

La app se abrirá automáticamente en tu navegador en:
**http://localhost:3000**

---

## Cómo usar la app

1. Escribe una opción en el campo de texto (ej. "Las Cascadas")
2. Presiona **"+ Agregar"** o la tecla **Enter**
3. Repite para agregar todas las opciones que quieras
4. Presiona **"¡Decidir por mí! 🎲"** para que la app elija una al azar
5. El resultado aparece en MAYÚSCULAS con la opción ganadora marcada ✓

Tus opciones se guardan automáticamente — si cierras el navegador y regresas, siguen ahí.

Para detener la app: presiona **Ctrl + C** en la terminal.

---

## Estructura del proyecto

```
decisor-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js       ← Lógica principal
│   ├── App.css      ← Estilos
│   ├── index.js     ← Punto de entrada
│   └── index.css    ← Estilos globales
├── package.json
└── README.md
```
