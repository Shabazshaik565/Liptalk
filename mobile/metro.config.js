const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to prefer CommonJS/browser/react-native conditions over 'import' to prevent raw import.meta in web bundles
config.resolver.unstable_conditionNames = ['require', 'browser', 'react-native'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    try {
      const resolution = require.resolve(moduleName, { paths: [__dirname] });
      return {
        type: 'sourceFile',
        filePath: resolution,
      };
    } catch (e) {
      // Fallback if require.resolve fails
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
