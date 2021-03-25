const BABEL_ENV = process.env.BABEL_ENV
const isCommonJS = BABEL_ENV !== undefined && BABEL_ENV === "cjs"
const isESM = BABEL_ENV !== undefined && BABEL_ENV === "esm"

module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      "@babel/env",
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
    // "@salesforce/babel-preset-design-system-react"
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
  ]

  return {
    presets,
    plugins,
  }
}
