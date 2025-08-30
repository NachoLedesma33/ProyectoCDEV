export class WindowResizer {
  constructor(camera, renderer, onResizeCallback = null) {
    this.camera = camera;
    this.renderer = renderer;
    this.onResizeCallback = onResizeCallback;
    
    window.addEventListener('resize', () => this.onWindowResize());
    this.onWindowResize(); // Initial call to set sizes
  }

  onWindowResize() {
    if (this.camera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    if (this.onResizeCallback) {
      this.onResizeCallback();
    }
  }
}

export default WindowResizer;
