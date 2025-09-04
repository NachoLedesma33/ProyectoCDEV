// Configuración de modelos 3D para el proyecto
// Este archivo centraliza la gestión de todos los modelos 3D del proyecto

const modelConfig = {
  // Ruta base donde se encuentran los modelos
  basePath: "/src/models/",

  // Configuración de personajes
  characters: {
    // Personaje principal (granjero)
    farmer: {
      model: "characters/Farmer/farmer.fbx",
      scale: 0.01,
      animations: {
        idle: "characters/Farmer/idle.fbx",
      },
    },

    // Monstruos
    monsters: {
      coco: {
        model: "characters/Monsters/Coco/coco.fbx",
        scale: 0.01,
        animations: {
          idle: "animations/monstersAnimations/coco_idle.fbx",
          attack: "animations/monstersAnimations/coco_attack.fbx",
        },
      },
      santi: {
        model: "characters/Monsters/ElSanti/santi.fbx",
        scale: 0.01,
        animations: {
          idle: "animations/monstersAnimations/santi_idle.fbx",
        },
      },
      alien: {
        model: "characters/Monsters/alien/alien.fbx",
        scale: 0.01,
        animations: {
          idle: "animations/monstersAnimations/alien_idle.fbx",
        },
      },
    },

    // Animales
    animals: {
      // Agregar configuraciones de animales aquí
    },
  },

  // Configuración de objetos del entorno
  environment: {
    // Agregar configuraciones de objetos del entorno aquí
  },

  // Configuración del cargador de modelos
  loaderConfig: {
    fbx: {
      // Configuraciones específicas para cargar archivos FBX
      crossOrigin: "anonymous",
      // Agregar más configuraciones según sea necesario
    },
  },

  /**
   * Obtiene la ruta completa de un modelo
   * @param {string} relativePath - Ruta relativa del modelo
   * @returns {string} Ruta completa del modelo
   */
  getModelPath: function (relativePath) {
    return `${this.basePath}${relativePath}`.replace(/\\/g, "/");
  },

  /**
   * Obtiene la configuración de un personaje
   * @param {string} characterType - Tipo de personaje (ej: 'farmer', 'monsters.coco')
   * @returns {Object} Configuración del personaje
   */
  getCharacterConfig: function (characterType) {
    const parts = characterType.split(".");
    let config = this.characters;

    for (const part of parts) {
      if (config[part] === undefined) {
        console.warn(`Configuración no encontrada para: ${characterType}`);
        return null;
      }
      config = config[part];
    }

    return config;
  },
};

export default modelConfig;
