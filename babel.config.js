module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['babel-plugin-root-import']],
};

// module.exports = (api) => {
//   api.cache(true);

//   return {
//     plugins: ['babel-plugin-root-import'],
//   };
// };
