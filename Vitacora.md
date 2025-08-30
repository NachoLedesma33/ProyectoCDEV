# Bitácora del Proyecto La Granja 3D

Este documento registra los cambios, mejoras y desafíos encontrados durante el desarrollo del proyecto de simulación 3D "La Granja".

## 30 de Agosto 2025

### Mejoras en los Controles de Cámara

#### Zoom Mejorado

- Implementado un sistema de zoom suave y progresivo
- Ajustados los límites de zoom para evitar ver más allá del terreno
- Añadida aceleración y desaceleración para un movimiento más natural
- Límites de distancia mínima (15 unidades) y máxima (40% del tamaño del terreno)

#### Rotación de Cámara

- Corregido el problema de la cámara que mostraba el vacío debajo del terreno
- Establecidos límites de ángulo vertical (0° a ~88°)
- Mejorada la suavidad de la rotación con amortiguación

#### Navegación

- Optimizado el movimiento de paneo (arrastre con clic derecho)
- Ajustada la velocidad de rotación y paneo para mejor control
- Implementado movimiento más intuitivo con el ratón

### Mejoras en el Terreno

- Optimizada la generación del terreno
- Mejorado el sistema de carga de texturas
- Añadido manejo de errores para la carga de recursos

### Interfaz de Usuario

- Añadido mensaje de carga inicial
- Incluidas instrucciones de controles en pantalla
- Mejorada la retroalimentación visual durante la interacción

## Próximas Mejoras

- [ ] Añadir objetos interactivos en el terreno
- [ ] Implementar sistema de día/noche
- [ ] Añadir efectos de iluminación dinámica
- [ ] Optimizar el rendimiento

---
*Documento actualizado el 30/08/2025*
