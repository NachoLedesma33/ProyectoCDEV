import * as THREE from 'three';

export class Lights {
  constructor(scene) {
    this.scene = scene;
    this.lights = {};
    this.setupLights();
  }

  setupLights() {
    // Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    this.lights.ambient = ambientLight;

    // Luz direccional (sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    
    // Configurar sombras
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    
    this.scene.add(directionalLight);
    this.lights.directional = directionalLight;

    // Añadir luz de relleno desde abajo para simular luz rebotada
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
    fillLight.position.set(-50, -50, -50);
    this.scene.add(fillLight);
    this.lights.fill = fillLight;
  }
}

export default Lights;
