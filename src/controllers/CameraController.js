import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraController {
  constructor(renderer) {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.5,
      20000
    );
    this.camera.position.set(0, 30, 50);
    
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.setupControls();
  }

  setupControls() {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1; // Aumentado para un movimiento más suave
    this.controls.minDistance = 30;
    this.controls.maxDistance = 2000;
    
    // Limitar el ángulo vertical para evitar ver por debajo del terreno
    this.controls.minPolarAngle = 0; // No permitir mirar hacia abajo más allá del horizonte
    this.controls.maxPolarAngle = Math.PI * 0.49; // Ligeramente menos de 90 grados para evitar el "flip"
    
    // Configuración de zoom
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 0.5;
    this.controls.enableSmoothZoom = true;
    this.controls.smoothZoomSpeed = 1.5;
    
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

  update() {
    this.controls.update();
  }
}

export default CameraController;
