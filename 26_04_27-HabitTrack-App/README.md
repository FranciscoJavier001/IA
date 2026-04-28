# habit.track

App de seguimiento de hábitos con cronómetro. Construida con React + Vite.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## Build para producción

```bash
npm run build
npm run preview
```

## Funcionalidades

- Agrega hábitos con nombre personalizado
- Cronómetro por hábito (solo uno activo a la vez)
- Al activar otro hábito, el anterior se pausa y guarda automáticamente
- Tiempo total acumulado por hábito con barra visual comparativa
- Historial por hábito en el menú lateral (☰)
  - Muestra 5 sesiones por defecto
  - Botón "Ver más" carga 5 sesiones adicionales cada vez
  - Al 4to clic muestra el historial completo
- Todo se guarda en localStorage — persiste al recargar
