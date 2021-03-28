import peerDepsExternal from "rollup-plugin-peer-deps-external"
// import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
// import typescript from "@rollup/plugin-typescript"
import typescript from "rollup-plugin-typescript2"
import postcss from "rollup-plugin-postcss"
import babel from "rollup-plugin-babel"
// import alias from "@rollup/plugin-alias"
// import lessTildeImporter from "@ovh-ux/rollup-plugin-less-tilde-importer"
// const path = require("path")
const packageJson = require("./package.json")

export default {
  input: "./src/index.tsx",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
    /^antd[.]*/,
  ],
  plugins: [
    peerDepsExternal(),
    // alias({
    //   entries: [{ find: "~", replacement: "../../node_modules" }],
    // }),
    // resolve({
    //   customResolveOptions: { moduleDirectory: ["../../node_modules"] },
    // }),

    commonjs(),
    // typescript({
    //   lib: ["es5", "es6", "dom"],
    //   target: "es5",
    // }),
    typescript({
      exclude: ["*.d.ts", "**/*.d.ts", "**/*.stories.tsx", "**/*.spec.tsx"],
      rollupCommonJSResolveHack: true,
      clean: true,
      useTsconfigDeclarationDir: true,
      // declarationDir:'dist/types'
    }),
    babel({
      // babelrc: false,
      plugins: [["import", { libraryName: "antd", style: true }]],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      exclude: /\**node_modules\**/,
    }),

    // lessTildeImporter({
    //   paths: [
    //     path.resolve(__dirname, "./node_modules"),
    //     path.resolve(__dirname, "../../node_modules"),
    //   ],
    // }),

    postcss({
      use: [["less", { javascriptEnabled: true }]],
    }),
  ],
}
