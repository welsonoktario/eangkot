module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => ({
        ...options,
        reactivityTransform: true,
      }));
  },
  configureWebpack: (config) => {
    config.devtool = "source-map";
  },
};
