// Importar módulos
import * as THREE from "three";
import SceneController from "./controllers/SceneController.js";
import CameraController from "./controllers/CameraController.js";
import { Lights } from "./utils/Lights.js";
import { WindowResizer } from "./utils/WindowResizer.js";
import { Terrain } from "./components/Terrain.js";
import { ModelLoader } from "./utils/ModelLoader.js";

// Hacer THREE disponible globalmente para otros módulos que lo necesiten
window.THREE = THREE;

// Variables globales
let sceneController, cameraController, lights, terrain;

// Inicializar la aplicación
async function init() {
  // Inicializar controladores
  sceneController = new SceneController();
  cameraController = new CameraController(sceneController.renderer);

  // Configurar luces
  lights = new Lights(sceneController.scene);

  // Configurar manejador de redimensionamiento
  new WindowResizer(cameraController.camera, sceneController.renderer, () =>
    cameraController.onWindowResize()
  );

  // Inicializar terreno
  console.log("Inicializando terreno...");
  try {
    terrain = new Terrain(sceneController.scene);
    console.log("Terreno inicializado correctamente");
  } catch (error) {
    console.error("Error al inicializar el terreno:", error);
    // Crear un plano simple como respaldo
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    sceneController.scene.add(plane);
  }

  // Cargar y mostrar personajes
  try {
    console.log("Cargando personajes...");
    const modelLoader = new ModelLoader();

    // Cargar el personaje granjero
    const farmer = await modelLoader.loadCharacter("farmer");
    farmer.model.position.set(0, 0, 0); // Posición inicial
    sceneController.scene.add(farmer.model);

    // Posicionar la cámara por encima del personaje
    const modelHeight = 2; // Altura estimada del modelo
    const cameraDistance = 5; // Distancia de la cámara al modelo
    cameraController.camera.position.set(
      0,
      modelHeight + cameraDistance,
      cameraDistance
    );
    cameraController.camera.lookAt(0, modelHeight, 0);

    console.log("Personajes cargados correctamente");
  } catch (error) {
    console.error("Error al cargar personajes:", error);
  }
  const urlParams = new URLSearchParams(window.location.search);
  const isDevelopment =
    urlParams.get("dev") === "true" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isDevelopment) {
    console.log("Modo desarrollo: Creando objetos de prueba...");
    createTestObjects();
  }

  // Configuración del zoom personalizado
  const minDistance = 1500; // Mínima distancia de zoom
  const maxDistance = 2000; // Máxima distancia de zoom
  const zoomStep = 45; // Cantidad de unidades que se acerca/aleja por paso de rueda
  let targetDistance = 3000; // Distancia objetivo inicial

  // Escuchar la rueda del ratón para el zoom personalizado
  sceneController.renderer.domElement.addEventListener(
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

  // Configuración de rotación y paneo
  cameraController.controls.rotateSpeed = 0.5; // Reduce la velocidad de rotación
  cameraController.controls.panSpeed = 0.5; // Reduce la velocidad de paneo

  // Ocultar mensaje de carga cuando todo esté listo
  setTimeout(() => {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.style.opacity = "0";
      setTimeout(() => (loadingElement.style.display = "none"), 300);
    }
  }, 500);

  // Iniciar el bucle de animación
  animate();
}

// Función para crear objetos de prueba (solo en desarrollo)
function createTestObjects() {
  // Plano de prueba
  const planeGeometry = new THREE.PlaneGeometry(20, 20);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1;
  plane.receiveShadow = true;
  sceneController.add(plane);
}

// Bucle de animación
function animate() {
  requestAnimationFrame(animate);

  // Actualizar controles de cámara
  cameraController.update();

  // Renderizar la escena
  sceneController.render(cameraController.camera);
}

// Iniciar la aplicación cuando el DOM esté listo
// Mostrar mensaje de carga
const loadingElement = document.createElement("div");
loadingElement.style.position = "fixed";
loadingElement.style.top = "10px";
loadingElement.style.left = "10px";
loadingElement.style.color = "white";
loadingElement.style.backgroundColor = "rgba(0,0,0,0.7)";
loadingElement.style.padding = "10px";
loadingElement.style.borderRadius = "5px";
loadingElement.style.zIndex = "1000";
loadingElement.textContent = "Cargando...";
document.body.appendChild(loadingElement);

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await init();
    // Una vez cargado todo, eliminar el mensaje de carga
    document.body.removeChild(loadingElement);
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    loadingElement.textContent = `Error al cargar: ${error.message}`;
    loadingElement.style.color = "red";
  }
});
