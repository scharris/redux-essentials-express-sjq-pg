const nodeExternals = require("webpack-node-externals");
const {merge} = require('webpack-merge');
const common = require('./common.config.js');

module.exports = merge(common, {
   mode: "development",
   watch: false,
   externals: [nodeExternals()]
});
