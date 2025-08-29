// Importar módulos
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Terrain } from './components/Terrain.js';

// Hacer THREE disponible globalmente para otros módulos que lo necesiten
window.THREE = THREE;

// Variables globales
let scene, camera, renderer, controls;

// Inicializar la escena
function init() {
  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  // No usar niebla global, se implementará niebla en los bordes manualmente
  scene.fog = null;

  // Configurar cámara con planos de recorte más adecuados
  camera = new THREE.PerspectiveCamera(
    60, // Reducir el campo de visión para una perspectiva más natural
    window.innerWidth / window.innerHeight,
    0.5, // Aumentar el plano cercano para evitar clipping con objetos cercanos
    20000 // Aumentar significativamente el plano lejano
  );
  camera.position.set(0, 30, 50); // Posición inicial más elevada

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("app").appendChild(renderer.domElement);

  // Controles de órbita
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Configuración de zoom y cámara
  controls.minDistance = 30; // Aumentada la distancia mínima para mejor navegación
  controls.maxDistance = 2000; // Aumentada la distancia máxima para el nuevo tamaño del mapa
  controls.maxPolarAngle = Math.PI / 2; // Limita el ángulo máximo de elevación
  controls.enableZoom = true;
  controls.zoomSpeed = 0.5; // Reducir velocidad de zoom para mayor control

  // Habilitar zoom suavizado nativo
  controls.enableSmoothZoom = true;
  controls.smoothZoomSpeed = 2.0; // Ajusta la velocidad del zoom suavizado

  // Configuración de amortiguación para movimientos suaves
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // Deshabilitar el zoom con la rueda nativo y usar uno personalizado
  controls.enableZoom = false;

  // Variables para el zoom personalizado
  let targetDistance = 30; // Distancia objetivo inicial (igual a la posición inicial de la cámara)
  const minDistance = 15; // Mínima distancia de zoom
  const maxDistance = 200; // Máxima distancia de zoom
  const zoomStep = 5; // Cantidad de unidades que se acerca/aleja por paso de rueda

  // Escuchar la rueda del ratón para el zoom personalizado
  renderer.domElement.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();

      // Calcular la nueva distancia objetivo
      const delta = Math.sign(event.deltaY) * zoomStep;
      targetDistance = THREE.MathUtils.clamp(
        targetDistance + delta,
        minDistance,
        maxDistance
      );
    },
    { passive: false }
  );

  // Actualizar la posición de la cámara en el bucle de animación
  const originalUpdate = controls.update;
  controls.update = function () {
    // Suavizar el movimiento hacia la distancia objetivo
    const currentDistance = camera.position.distanceTo(controls.target);
    const newDistance = THREE.MathUtils.lerp(
      currentDistance,
      targetDistance,
      0.1 // Factor de suavizado (0.1 = muy suave, 1.0 = instantáneo)
    );

    // Ajustar la posición de la cámara
    const direction = camera.position
      .clone()
      .sub(controls.target)
      .normalize()
      .multiplyScalar(newDistance);
    camera.position.copy(controls.target).add(direction);

    // Llamar al update original
    return originalUpdate.apply(this, arguments);
  };

  // Configuración de rotación y paneo
  controls.rotateSpeed = 0.5; // Reduce la velocidad de rotación
  controls.panSpeed = 0.5; // Reduce la velocidad de paneo

  // Configurar luces
  setupLights();

  // Crear terreno
  new Terrain(scene);

  // Crear objetos de prueba
  createTestObjects();

  // Manejar redimensionamiento
  window.addEventListener("resize", onWindowResize);

  // Ocultar mensaje de carga cuando todo esté listo
  setTimeout(() => {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.style.opacity = "0";
      setTimeout(() => (loadingElement.style.display = "none"), 300);
    }
  }, 1500);

  // Iniciar animación
  animate();
}

// Configurar iluminación
function setupLights() {
  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Luz solar (direccional)
  const sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.set(100, 100, 50);
  sunLight.castShadow = true;

  // Configurar sombras
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 500;
  sunLight.shadow.camera.left = -100;
  sunLight.shadow.camera.right = 100;
  sunLight.shadow.camera.top = 100;
  sunLight.shadow.camera.bottom = -100;

  scene.add(sunLight);

  // Luz de relleno
  const fillLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.5);
  fillLight.position.set(0, 1, 0);
  scene.add(fillLight);
}

// Clase Terrain movida a src/components/Terrain.js

// Crear objetos de prueba
function createTestObjects() {
  // Cubo de prueba
  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4caf50,
    roughness: 0.7,
    metalness: 0.2,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 1, 0);
  cube.castShadow = true;
  scene.add(cube);

  // Esfera de prueba
  const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x2196f3,
    roughness: 0.3,
    metalness: 0.8,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(5, 1.5, 5);
  sphere.castShadow = true;
  scene.add(sphere);
}

// Manejar redimensionamiento de la ventana
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Bucle de animación
function animate() {
  requestAnimationFrame(animate);

  // Actualizar controles
  controls.update();

  // Actualizar la posición de la niebla para que siga a la cámara
  if (scene.fog) {
    scene.fog.near = camera.position.y * 0.5;
    scene.fog.far = camera.position.y * 2;
  }

  renderer.render(scene, camera);
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);
