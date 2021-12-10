const path = require("path");
const nodeExternals = require("webpack-node-externals");
const {merge} = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./common.config.js');

module.exports = merge(common, {
   mode: "production",
   watch: false,
   externals: [nodeExternals()],
   plugins: [
      new CopyPlugin({
         patterns: [
            { from: path.join(__dirname, "../../client/build"), to: "public" }
         ]
      })
   ]
});
