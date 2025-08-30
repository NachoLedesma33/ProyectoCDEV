# La Granja - Proyecto CDEV

Proyecto final para la materia CDEV (Creatividad y Desarrollo de Entornos Virtuales).

## Descripción

Este proyecto utiliza Three.js para crear visualizaciones 3D interactivas en el navegador.

## Requisitos Previos

- Node.js (versión 14.x o superior)
- npm (incluido con Node.js)

### Instalación de dependencias

```bash
# Instalar Three.js
npm install three

# Instalar dependencias de desarrollo para pruebas
npm install --save-dev @babel/core @babel/preset-env @babel/preset-typescript @types/jest jest ts-jest
```

### Comandos de prueba disponibles

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo observación (se actualizan automáticamente)
npm run test:watch

# Generar reporte de cobertura de pruebas
npm run test:coverage
```

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/LaGranja.git
   cd LaGranja
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Dependencias

- [Three.js](https://threejs.org/) (^0.179.1) - Biblioteca de gráficos 3D para la web

## Estructura del Proyecto

```
LaGranja/
├── src/                 # Código fuente
│   ├── assets/          # Recursos (texturas, modelos, etc.)
│   ├── components/      # Componentes de Three.js
│   ├── models/          # Modelos 3D
│   └── styles/          # Estilos CSS
├── index.html           # Punto de entrada de la aplicación
└── package.json         # Configuración del proyecto y dependencias
```

## Autor

Ignacio Ledesma - [nacholedesma33@gmail.com]

---

Proyecto creado para la materia CDVE - 2025
