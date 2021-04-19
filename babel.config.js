const BABEL_ENV = process.env.BABEL_ENV
const isCommonJS = BABEL_ENV !== undefined && BABEL_ENV === "cjs"
const isESM = BABEL_ENV !== undefined && BABEL_ENV === "esm"

console.log(BABEL_ENV)

module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: isCommonJS ? "commonjs" : false,
        targets: {
          esmodules: isESM ? true : undefined,
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ]

  const plugins = [
    "@chakra-ui/babel-plugin",
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    // ["import", { libraryName: "antd", style: true }],
    // [
    //   "react-css-modules",
    //   {
    //     filetypes: {
    //       ".less": {
    //         syntax: "postcss-less",
    //       },
    //     },
    //     generateScopedName: "[name]--[local]--[hash:base64:5]",
    //   },
    // ],
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-export-namespace-from',
  ]

  return {
    presets,
    plugins,
  }
}
