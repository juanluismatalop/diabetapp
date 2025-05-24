const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Añade estas líneas para resolver el problema de Firebase Auth con Hermes/Metro
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false; // Esta línea es clave para SDK 53

module.exports = config;