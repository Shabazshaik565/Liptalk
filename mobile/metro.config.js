const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to prefer CommonJS/browser/react-native conditions over 'import' to prevent raw import.meta in web bundles
config.resolver.unstable_conditionNames = ['require', 'browser', 'react-native'];

module.exports = config;
