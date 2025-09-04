import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import modelConfig from "../config/modelConfig.js";

export class ModelLoader {
  constructor() {
    this.loader = new FBXLoader();
    this.cache = new Map(); // Cache para modelos cargados

    // Configurar el cargador con las opciones por defecto
    Object.entries(modelConfig.loaderConfig.fbx).forEach(([key, value]) => {
      this.loader.setCrossOrigin(value);
    });
  }

  /**
   * Carga un modelo 3D
   * @param {string} modelPath - Ruta relativa del modelo
   * @param {Object} options - Opciones de carga
   * @returns {Promise<THREE.Group>} Modelo 3D cargado
   */
  async loadModel(modelPath, options = {}) {
    const fullPath = modelConfig.getModelPath(modelPath);

    // Verificar si el modelo ya está en caché
    if (this.cache.has(fullPath)) {
      return this.cloneModel(this.cache.get(fullPath));
    }

    try {
      const model = await new Promise((resolve, reject) => {
        this.loader.load(
          fullPath,
          (object) => {
            // Aplicar configuración por defecto
            if (options.scale) {
              object.scale.setScalar(options.scale);
            }

            // Almacenar en caché
            this.cache.set(fullPath, object);

            // Clonar el modelo para evitar problemas de referencia
            resolve(this.cloneModel(object));
          },
          // onProgress callback
          (xhr) => {
            const percent = (xhr.loaded / xhr.total) * 100;
            console.log(
              `Cargando modelo ${modelPath}: ${Math.round(percent)}%`
            );
          },
          // onError callback
          (error) => {
            console.error(`Error al cargar el modelo ${modelPath}:`, error);
            reject(error);
          }
        );
      });

      return model;
    } catch (error) {
      console.error(`Error en loadModel para ${modelPath}:`, error);
      throw error;
    }
  }

  /**
   * Carga un personaje con sus animaciones
   * @param {string} characterType - Tipo de personaje (ej: 'farmer', 'monsters.coco')
   * @returns {Promise<Object>} Objeto con el modelo y sus animaciones
   */
  async loadCharacter(characterType) {
    const config = modelConfig.getCharacterConfig(characterType);
    if (!config) {
      throw new Error(
        `Configuración no encontrada para el personaje: ${characterType}`
      );
    }

    try {
      // Cargar el modelo principal
      const model = await this.loadModel(config.model, {
        scale: config.scale || 1,
      });

      // Cargar animaciones si existen
      const animations = {};
      if (config.animations) {
        for (const [name, animPath] of Object.entries(config.animations)) {
          try {
            const anim = await this.loadModel(animPath);
            animations[name] = anim.animations || [];
          } catch (error) {
            console.warn(
              `No se pudo cargar la animación ${name} para ${characterType}:`,
              error
            );
          }
        }
      }

      return {
        model,
        animations,
        config,
      };
    } catch (error) {
      console.error(`Error al cargar el personaje ${characterType}:`, error);
      throw error;
    }
  }

  /**
   * Clona un modelo 3D
   * @private
   */
  cloneModel(model) {
    // Crear una copia del modelo
    const clone = model.clone();

    // Clonar materiales si existen
    if (model.material) {
      if (Array.isArray(model.material)) {
        clone.material = model.material.map((mat) => mat.clone());
      } else {
        clone.material = model.material.clone();
      }
    }

    // Clonar geometrías si existen
    if (model.geometry) {
      clone.geometry = model.geometry.clone();
    }

    // Clonar animaciones si existen
    if (model.animations) {
      clone.animations = model.animations.map((a) => a.clone());
    }

    return clone;
  }

  /**
   * Limpia la caché de modelos
   */
  clearCache() {
    this.cache.clear();
  }
}
