# Generador de Nombre de Usuario

App en React + Vite que genera nombres de usuario únicos a partir de tus iniciales, año y país de nacimiento.

## Ejemplo
**Francisco Javier Martínez Durán · 1987 · México → `fjmd1987mx`**

## Cómo correrla

### Requisitos
- Node.js 18 o superior
- npm 9 o superior

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

### Build para producción

```bash
npm run build
npm run preview
```

## Estructura

```
username-generator/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx        # Entry point
    ├── App.jsx         # Componente principal + lógica
    ├── App.module.css  # Estilos con CSS Modules
    └── index.css       # Estilos globales + variables
```

## Características
- Genera múltiples variantes de nombre de usuario
- Soporta acentos y caracteres especiales
- Modo oscuro automático (sigue el sistema)
- Responsive para móvil y escritorio
- Copiar al portapapeles con un clic
- Desglose visual de cada parte del usuario (iniciales / año / país)
