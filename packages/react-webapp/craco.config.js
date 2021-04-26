const CracoLessPlugin = require('craco-less');
const CracoBabelLoader = require("craco-babel-loader");
const CracoAlias = require("craco-alias");

const path = require("path");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              '@primary-color': '#1DA57A',
              '@layout-sider-background': '#000'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoBabelLoader,
      options: {
        includes: [
          // /(node_modules\/@salesforce\/design-system-react\/)/,
          {
            test: /\.jsx?$/,
            include: [
                path.join(__dirname, '../../node_modules/@salesforce/design-system-react'),
            ]
          }
        ]
      }
    },
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: "./",
        aliases: {
          // "@emotion/core": path.join(__dirname, '../../node_modules/@emotion/react'),
          // "emotion-theming": path.join(__dirname, '../../node_modules/@emotion/react'),
        }
      }
    }
  ],
};
