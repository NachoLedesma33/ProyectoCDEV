import * as THREE from 'three';

export class Terrain {
  constructor(scene) {
    if (!scene) {
      throw new Error('Scene is required for Terrain constructor');
    }
    this.scene = scene;
    this.terrainSize = 2000;
    this.terrain = null;
    this.createTerrain();
  }

  createTerrain() {
    const segments = 400;
    const geometry = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize, segments, segments);
    
    // Cargar texturas
    const textureLoader = new THREE.TextureLoader();
    const grassColor = textureLoader.load(
      "https://threejs.org/examples/textures/terrain/grasslight-big.jpg"
    );
    grassColor.wrapS = grassColor.wrapT = THREE.RepeatWrapping;
    grassColor.repeat.set(20, 20);

    // Material base
    const material = new THREE.MeshStandardMaterial({
      map: grassColor,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.2,
    });

    // Crear malla del terreno
    this.terrain = new THREE.Mesh(geometry, material);
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.receiveShadow = true;
    
    // Guardar la textura para el material personalizado
    this.grassColor = grassColor;

    // Aplicar material personalizado con niebla
    this.applyFogMaterial();
    
    // Generar relieve y montañas
    this.generateTerrainHeight();
    
    // Añadir al escenario
    this.scene.add(this.terrain);
  }

  applyFogMaterial() {
    const fogMaterial = new THREE.ShaderMaterial({
      uniforms: {
        "map": { value: this.grassColor },
        "fogColor": { value: new THREE.Color(0x87ceeb) },
        "fogDistance": { value: 0.9 },
        "fogMaxIntensity": { value: 0.95 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vDistanceFromCenter;
        uniform float fogDistance;
        
        void main() {
          vUv = uv;
          vDistanceFromCenter = length(position.xz) / 1000.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec3 fogColor;
        uniform float fogDistance;
        uniform float fogMaxIntensity;
        varying vec2 vUv;
        varying float vDistanceFromCenter;
        
        void main() {
          vec4 texelColor = texture2D(map, vUv * 20.0);
          float fogIntensity = 0.0;
          
          if (vDistanceFromCenter > fogDistance) {
            fogIntensity = smoothstep(0.0, 1.0, (vDistanceFromCenter - fogDistance) / (1.0 - fogDistance));
            fogIntensity *= fogMaxIntensity;
          }
          
          vec3 finalColor = mix(texelColor.rgb, fogColor, fogIntensity);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });

    this.terrain.material = fogMaterial;
  }

  generateTerrainHeight() {
    const vertices = this.terrain.geometry.attributes.position;
    const flatArea = this.terrainSize * 0.6;
    const mountainStart = this.terrainSize * 0.6;
    const mountainEnd = this.terrainSize * 0.95;
    const maxMountainHeight = 80;

    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      const distance = Math.sqrt(x * x + y * y);
      
      let height = 0;
      
      // Zona de montañas
      if (distance > mountainStart) {
        let mountainFactor = (distance - mountainStart) / (mountainEnd - mountainStart);
        mountainFactor = Math.min(1, Math.max(0, mountainFactor));
        
        const noiseScale = 0.01;
        const noise1 = Math.sin(x * noiseScale) * Math.cos(y * noiseScale * 1.3) * 2;
        const noise2 = Math.sin(x * noiseScale * 2.1) * Math.cos(y * noiseScale * 1.7) * 1.5;
        
        mountainFactor = Math.pow(mountainFactor, 0.7);
        height = Math.pow(mountainFactor, 2) * maxMountainHeight * (1 + noise1 * 0.2 + noise2 * 0.1);
        
        if (distance > this.terrainSize * 0.9) {
          const edgeFactor = (distance - this.terrainSize * 0.9) / (this.terrainSize * 0.1);
          height += edgeFactor * 30;
        }
      } 
      // Zona central con relieve suave
      else if (distance > this.terrainSize * 0.1) {
        const noiseScale = 0.02;
        const noiseValue = Math.sin(x * noiseScale) * Math.cos(y * noiseScale) * 10;
        height = noiseValue * (1 - (distance / flatArea));
      }
      
      vertices.setZ(i, height);
    }
    
    this.terrain.geometry.computeVertexNormals();
  }
}
