module.exports = compilation => {
  if (!compilation || !compilation.outputOptions) return "/";

  return compilation.outputOptions.publicPath || "/";
};
