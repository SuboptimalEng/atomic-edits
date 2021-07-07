module.exports = {
  configureWebpack: {
    // TODO: Hide source maps this
    // devtool: 'source-map',
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/background/preload.js',
      mainProcessFile: 'src/background/main.js',
      rendererProcessFile: 'src/renderer/main.js',

      // INSIGHT: FFMPEG webpack import issue
      externals: ['@ffmpeg-installer/ffmpeg'],

      // INSIGHT: What does this do lol?
      // extraFiles: {
      //   from: 'node_modules/@ffmpeg-installer/**',
      //   to: './resources/app.asar.unpacked/@ffmpeg-installer/',
      // },

      // INSIGHT: FFMPEG Issue
      chainWebpackMainProcess: (config) => {
        config.plugin('define').tap((args) => {
          args[0]['process.env.FLUENTFFMPEG_COV'] = false;
          return args;
        });
      },
    },
  },
};
