module.exports = {
  configureWebpack: {
    // TODO: Hide this
    devtool: 'source-map',
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background/main.js',
      rendererProcessFile: 'src/renderer/main.js',
    },
  },
};
