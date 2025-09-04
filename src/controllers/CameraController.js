import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class CameraController {
  constructor(renderer) {
    this.camera = new THREE.PerspectiveCamera(
      75, // Reducir el campo de visión para un zoom más natural
      window.innerWidth / window.innerHeight,
      0.5,
      1500 // Reducir la distancia máxima de renderizado
    );
    this.camera.position.set(50, 500, 50); // Aumentada la altura de 35 a 500 para una vista aérea
    this.terrainSize = 5000; // Tamaño del terreno para cálculos de límites

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
    domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();

        // Obtener la dirección del scroll (1 para acercar, -1 para alejar)
        const delta = Math.sign(event.deltaY);

        // Calcular el factor de zoom basado en la dirección del scroll
        const zoomFactor = delta > 0 ? 0.9 : 1.1; // Reducir o aumentar el zoom en un 10%

        // Aplicar el zoom basado en la distancia actual al objetivo
        const direction = new THREE.Vector3();
        direction
          .subVectors(this.camera.position, this.controls.target)
          .normalize();

        // Calcular la nueva distancia manteniendo los límites
        const currentDistance = this.camera.position.distanceTo(
          this.controls.target
        );
        let newDistance = currentDistance * zoomFactor;

        // Aplicar límites al zoom
        newDistance = Math.max(
          this.controls.minDistance,
          Math.min(this.controls.maxDistance, newDistance)
        );

        // Solo actualizar si hay un cambio significativo
        if (Math.abs(newDistance - currentDistance) > 0.01) {
          // Calcular la nueva posición de la cámara
          const newPosition = new THREE.Vector3();
          newPosition.addVectors(
            this.controls.target,
            direction.multiplyScalar(newDistance)
          );

          // Asegurar que la cámara no vaya por debajo del terreno
          newPosition.y = Math.max(10, newPosition.y);

          // Actualizar la posición de la cámara
          this.camera.position.copy(newPosition);
        }
      },
      { passive: false }
    );
  }

  update() {
    // Actualizar los controles de la cámara
    this.controls.update();
  }
}

export default CameraController;
