import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraController {
  constructor(renderer) {
    this.camera = new THREE.PerspectiveCamera(
      75, // Reducir el campo de visión para un zoom más natural
      window.innerWidth / window.innerHeight,
      0.5,
      1500 // Reducir la distancia máxima de renderizado
    );
    this.camera.position.set(50, 35, 50);
    this.terrainSize = 2000; // Tamaño del terreno para cálculos de límites
    
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    
    // Configuración de zoom suavizado
    this.zoomSpeed = 5;
    this.targetZoom = null;
    this.zoomDamping = 0.5;
    
    // Desactivar el zoom por defecto de OrbitControls
    this.controls.enableZoom = false;
    
    // Configurar el evento de rueda personalizado
    this.setupWheelZoom(renderer.domElement);
    
    this.setupControls();
  }

  setupControls() {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.5; // Aumentado para un movimiento más suave
    this.controls.minDistance = 15; // Distancia mínima reducida
    this.controls.maxDistance = this.terrainSize * 0.8; // Máximo 80% del tamaño del terreno
    
    // Limitar el ángulo vertical para evitar ver por debajo del terreno
    this.controls.minPolarAngle = 0; // No permitir mirar hacia abajo más allá del horizonte
    this.controls.maxPolarAngle = Math.PI * 0.49; // Ligeramente menos de 90 grados para evitar el "flip"
    
    // Configuración de zoom (manejado manualmente)
    this.controls.enableZoom = false; // Desactivar el zoom predeterminado
    
    // Configuración de rotación
    this.controls.rotateSpeed = 0.5;
    this.controls.enableRotate = true;
    
    // Configuración de paneo
    this.controls.enablePan = true;
    this.controls.panSpeed = 0.5;
    this.controls.screenSpacePanning = true; // Mejor comportamiento en perspectiva
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  setupWheelZoom(domElement) {
    domElement.addEventListener('wheel', (event) => {
      event.preventDefault();
      
      // Calcular el factor de zoom basado en la dirección del scroll
      const delta = -event.deltaY * 0.000000005; // Reducir la sensibilidad
      const currentZoom = this.camera.position.distanceTo(this.controls.target);
      
      // Aplicar una función de aceleración para un zoom más natural
      const zoomFactor = 1.05; // Reducir el factor de zoom para un cambio más suave
      this.targetZoom = currentZoom * (delta > 0 ? zoomFactor : 1 / zoomFactor);
      
      // Calcular límites dinámicos basados en la posición actual
      const maxVisibleDistance = this.terrainSize * 0.4; // 40% del tamaño del terreno
      
      // Asegurar que el zoom esté dentro de los límites
      this.targetZoom = Math.max(
        this.controls.minDistance,
        Math.min(maxVisibleDistance, this.targetZoom)
      );
      
      // Ajustar la posición del target para mantener el terreno visible
      const direction = this.camera.position.clone()
        .sub(this.controls.target)
        .normalize();
      
      // Asegurar que la cámara no se salga de los límites del terreno
      const newPosition = this.controls.target.clone()
        .add(direction.multiplyScalar(this.targetZoom));
      
      // Limitar la altura mínima de la cámara
      newPosition.y = Math.max(10, newPosition.y);
    }, { passive: false });
  }
  
  update() {
    // Actualizar zoom suavizado si hay un objetivo
    if (this.targetZoom !== null) {
      const currentZoom = this.camera.position.distanceTo(this.controls.target);
      const diff = this.targetZoom - currentZoom;
      
      // Si la diferencia es muy pequeña, detener la animación
      if (Math.abs(diff) < 0.1) {
        this.targetZoom = null;
      } else {
        // Aplicar zoom suavizado
        const newZoom = currentZoom + diff * this.zoomDamping;
        
        // Mover la cámara a la nueva posición
        const direction = this.controls.target
          .clone()
          .sub(this.camera.position)
          .normalize()
          .multiplyScalar(newZoom);
        
        this.camera.position.copy(
          this.controls.target.clone().sub(direction)
        );
      }
    }
    
    this.controls.update();
  }
}

export default CameraController;
