module.exports = (compilation, autoToEmpty) => {
  if (!compilation || !compilation.outputOptions) return "";

  const { publicPath } = compilation.outputOptions;

  const path = publicPath || "";

  return autoToEmpty && path === "auto" ? "" : path;
};
