# La Granja - Proyecto CDEV

Proyecto final para la materia CDEV (Creatividad y Desarrollo de Entornos Virtuales).

## Descripción

Este proyecto utiliza Three.js para crear visualizaciones 3D interactivas en el navegador, implementando un entorno de granja virtual con diferentes componentes y controles de cámara.

## Requisitos Previos

- Node.js (versión 16.x o superior)
- npm (versión 8.x o superior, incluido con Node.js)
- Navegador web moderno con soporte para WebGL

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/NachoLedesma33/ProyectoCDEV.git
   cd ProyectoCDEV
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Dependencias Principales

- [Three.js](https://threejs.org/) (^0.179.1) - Biblioteca de gráficos 3D para la web

### Dependencias de Desarrollo

- `@babel/core` y presets - Para transpilación de código
- `jest` - Para pruebas unitarias
- `ts-jest` - Soporte para TypeScript en pruebas
- `@types/jest` - Tipos para Jest

## Estructura del Proyecto

```
LaGranja/
├── src/
│   ├── assets/          # Recursos estáticos (texturas, modelos, etc.)
│   ├── components/      # Componentes de Three.js
│   │   └── Terrain.js   # Generación del terreno
│   ├── config/          # Configuraciones
│   │   └── modelConfig.js
│   ├── controllers/     # Controladores de la aplicación
│   │   ├── CameraController.js
│   │   └── SceneController.js
│   └── models/          # Modelos 3D y lógica relacionada
├── test/               # Pruebas unitarias
├── index.html          # Punto de entrada de la aplicación
├── package.json        # Configuración del proyecto y dependencias
└── README.md           # Este archivo
```

## Comandos Disponibles

```bash
# Iniciar el servidor de desarrollo
npm start

# Ejecutar tests
npm test

# Ejecutar tests en modo observación
npm run test:watch

# Generar reporte de cobertura de pruebas
npm run test:coverage
```

## Configuración

El archivo `src/config/modelConfig.js` contiene configuraciones importantes para los modelos y la escena. Asegúrate de revisarlo antes de iniciar la aplicación.

## Autor

Ignacio Ledesma - [nacholedesma33@gmail.com]

---

Proyecto creado para la materia CDEV - 2025
