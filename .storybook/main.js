const path = require("path")
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

require('dotenv-flow').config(process.cwd());
const toPath = (_path) => path.join(process.cwd(), _path)

module.exports = {
  stories: ["../packages/**/stories/*.stories.tsx"],
  // addons: [
  //   "storybook-addon-performance/register",
  //   "@storybook/addon-a11y",
  //   "@storybook/addon-toolbars",
  // ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
    }
  },
  webpackFinal: async (config) => {

    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
        config.resolve.plugins = [new TsconfigPathsPlugin()];
    }
    //Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.less$/,
      use: [
        { 
          loader: 'style-loader', 
        }, 
        { 
          loader: 'css-loader', 
          options: {
            importLoaders: 1,
            modules: true,
          }
        }, 
        { 
          loader: 'less-loader',
          options: {
            lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
              javascriptEnabled: true,
            },
          },
        },
      ],
      include: [path.resolve(__dirname,"../packages"),path.resolve(__dirname, '../node_modules/antd'), path.resolve(__dirname, '../node_modules/@ant-design/')],
      // include: path.resolve(__dirname, '../node_modules/')
    });

    // config.module.rules.push({
    //     test: /\.jsx?$/,
    //     loaders: ['babel-loader'],
    //     include: [
    //         path.join(__dirname, '../node_modules/@salesforce/design-system-react'),
    //     ]
    // })

    config.node = {
      module: 'empty',
      dgram: 'empty',
      // path: 'mock',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    };
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@emotion/core": toPath("node_modules/@emotion/react"),
          "emotion-theming": toPath("node_modules/@emotion/react"),
        },
      },
    }
  },
}
