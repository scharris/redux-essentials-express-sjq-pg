const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const {merge} = require('webpack-merge');
const common = require('./common.config.js');

module.exports = merge(common, {
   mode: "development",
   watch: true,
   entry: ["webpack/hot/poll?100"],
   externals: [
      nodeExternals({
         allowlist: ["webpack/hot/poll?100"]
      })
   ],
   plugins: [
      new webpack.HotModuleReplacementPlugin()
   ]
});
