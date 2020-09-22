module.exports = compilation => {
  if (!compilation || !compilation.outputOptions) return "";

  const { publicPath } = compilation.outputOptions;

  return publicPath !== undefined ? publicPath : "";
};
