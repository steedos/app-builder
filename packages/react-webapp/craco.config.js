const CracoLessPlugin = require('craco-less');
const CracoBabelLoader = require("craco-babel-loader");
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
            /(node_modules\/@salesforce\/design-system-react\/)/,
        ]
      }
    }
  ],
};
