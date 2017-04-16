module.exports = compilation => {
  if (
    !compilation ||
    !compilation.mainTemplate ||
    !compilation.mainTemplate.outputOptions
  )
    return "/";

  return compilation.mainTemplate.outputOptions.publicPath || "/";
};
