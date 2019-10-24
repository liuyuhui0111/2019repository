module.exports = {
  presets: [
    '@vue/app',
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
        // 'dynamic-import-webpack': 'dynamic-import-webpack',
      },
    ],
  ],
};
