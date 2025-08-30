// Mock para WebGLRenderer
class WebGLRenderer {
  constructor() {
    this.domElement = document.createElement('canvas');
    this.shadowMap = { enabled: false, type: null };
    this.setSize = jest.fn();
    this.setPixelRatio = jest.fn();
    this.render = jest.fn();
  }
}

// Mock para THREE
const THREE = {
  Scene: jest.fn().mockImplementation(() => ({
    background: null,
    fog: null,
    add: jest.fn(),
    remove: jest.fn()
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => new WebGLRenderer()),
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
  PCFSoftShadowMap: 'PCFSoftShadowMap',
  MathUtils: {
    lerp: (a, b, t) => a + (b - a) * t,
    clamp: (value, min, max) => Math.min(Math.max(value, min), max)
  }
};

global.THREE = THREE;
