const { getPath, getConfig } = require('./utils/webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = getConfig({
  entry: getPath('src/server/index.tsx'),
  output: {
    filename: 'index.js',
    path: getPath('build'),
    publicPath: '/static/',
    // Expose module.exports from entry for firebase to run
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  // Do not bundle all external libraries
  externals: [
    nodeExternals({
      allowlist: [/\.css\?global$/],
    }),
  ],

  rules: [
    // Load ejs file as a template function
    {
      test: /\.ejs?$/,
      use: [{ loader: 'ejs-webpack-loader' }],
    },
  ],
})
