const webpack = require('webpack');
const path = require("path");
const { AureliaPlugin } = require("aurelia-webpack-plugin");
var OfflinePlugin = require('offline-plugin');

module.exports = {
  entry:
  {
    vendor: ["aurelia-animator-css"],
    app: "aurelia-bootstrapper",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "[name].js",
    chunkFilename: "[name].js"
  },

  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src", "node_modules"].map(x => path.resolve(x)),
  },

  module: {
    rules: [
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      { test: /\.ts$/i, use: ["babel-loader", "awesome-typescript-loader"] },
      { test: /\.html$/i, use: "html-loader" },
      { test: /\.(png|jpg|gif)$/i, use: "url-loader" },
      { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, use: 'url-loader' }

    ]
  },

  plugins: [
    new AureliaPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",

      // filename: "vendor.js"
      // (Give the chunk a different name)

      minChunks: Infinity,
      // (with more entries, this ensures that no other module
      //  goes into the vendor chunk)
    }),
    new OfflinePlugin({
      publicPath: '/',
      caches: {
        main: [
          'dist/0.js',
          'dist/1.js',
          'app.js',
          'vendor.js',
          'twitter.png',
          'whatsapp.png',
          'github.png'
        ],
        additional: [
          ':externals:'
        ],
        optional: [
          ':rest:'
        ]
      },
      externals: [
        '/'
      ],
      ServiceWorker: {
        navigateFallbackURL: '/'
      },
      AppCache: {
        FALLBACK: {
          '/': '/offline-page.html'
        }
      }
    })]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true,
        drop_console: true,
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
} else {
  module.exports.devtool = '#source-map'
}