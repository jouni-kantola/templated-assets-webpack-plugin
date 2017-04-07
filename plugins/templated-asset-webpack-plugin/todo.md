1. default to url asset, if neither url or inline is specified
2. specify output file extension, default to ".html"
3. specify output file prefix, default to ""
4. maybe define output config: output: { inline: true, url: false, prefix: "", ext: ".cshtml"}
5. create unit tests for templated-chunks (templated-assets)
6. rename templated-chunks to templated-assets
7. maybe defined other output directory than default webpack directory
8. handle exclusion of output (from compilation.chunks || compilation.assets)
9. support creating a async+defer asset
10. handle public path