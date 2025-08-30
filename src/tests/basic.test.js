import { SceneController } from '../controllers/SceneController.js';
import { CameraController } from '../controllers/CameraController.js';
import { Lights } from '../utils/Lights.js';

// Mock de THREE.js para pruebas
jest.mock('three', () => ({
  Scene: jest.fn().mockImplementation(() => ({
    background: null,
    fog: null,
    add: jest.fn(),
    remove: jest.fn()
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    shadowMap: {
      enabled: false,
      type: null
    },
    domElement: document.createElement('canvas')
  })),
  Color: jest.fn(),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    castShadow: false,
    shadow: {
      mapSize: { width: 0, height: 0 },
      camera: { near: 0, far: 0, left: 0, right: 0, top: 0, bottom: 0 }
    }
  })),
  PCFSoftShadowMap: 'PCFSoftShadowMap'
}));

describe('SceneController', () => {
  let sceneController;

  beforeEach(() => {
    sceneController = new SceneController();
  });

  test('debería inicializar correctamente', () => {
    expect(sceneController).toBeDefined();
    expect(sceneController.scene).toBeDefined();
    expect(sceneController.renderer).toBeDefined();
  });

  test('debería manejar el redimensionamiento', () => {
    const mockSetSize = jest.fn();
    sceneController.renderer.setSize = mockSetSize;
    
    sceneController.onWindowResize();
    
    expect(mockSetSize).toHaveBeenCalledWith(window.innerWidth, window.innerHeight);
  });
});

describe('CameraController', () => {
  let cameraController;
  const mockRenderer = { domElement: document.createElement('div') };

  beforeEach(() => {
    cameraController = new CameraController(mockRenderer);
  });

  test('debería inicializar correctamente', () => {
    expect(cameraController).toBeDefined();
    expect(cameraController.camera).toBeDefined();
    expect(cameraController.controls).toBeDefined();
  });

  test('debería manejar el redimensionamiento', () => {
    const mockUpdateProjectionMatrix = jest.fn();
    cameraController.camera.aspect = 1;
    cameraController.camera.updateProjectionMatrix = mockUpdateProjectionMatrix;
    
    cameraController.onWindowResize();
    
    expect(cameraController.camera.aspect).toBe(window.innerWidth / window.innerHeight);
    expect(mockUpdateProjectionMatrix).toHaveBeenCalled();
  });
});

describe('Lights', () => {
  let lights;
  const mockScene = { add: jest.fn() };

  beforeEach(() => {
    lights = new Lights(mockScene);
  });

  test('debería inicializar correctamente', () => {
    expect(lights).toBeDefined();
    expect(lights.lights.ambient).toBeDefined();
    expect(lights.lights.directional).toBeDefined();
    expect(lights.lights.fill).toBeDefined();
  });

  test('debería configurar correctamente las luces direccionales', () => {
    expect(lights.lights.directional.position).toBeDefined();
    expect(lights.lights.directional.castShadow).toBe(true);
    expect(lights.lights.directional.shadow.mapSize.width).toBe(2048);
    expect(lights.lights.directional.shadow.mapSize.height).toBe(2048);
  });
});
