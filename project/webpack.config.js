var path = require("path");
var webpack = require("webpack");
var BundleTracker = require("webpack-bundle-tracker");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); 
const Visualizer = require("webpack-visualizer-plugin2");
const { StatsWriterPlugin } = require("webpack-stats-plugin");
 
 
var conf_base = {
  stats: {
    children: true,
  },
  resolve: {
    extensions: [".js", ".css"],
    fallback: {
      fs: false,
      crypto: false,
      stream: false,
    },
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  context: __dirname,
  entry: { 
    main_page: "./assets/js/main",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(ico|woff|woff2|ttf|eot)$/,
        use: {
          loader: "url-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|gif|jpe?g)$/,
        use: [
          {
            options: {
              name: "[name].[ext]",
              outputPath: "img/",
            },
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve("./assets/dist/"), 
    filename: "[contenthash].js",
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new BundleTracker({
      filename: "./assets/dist/webpack-stats.json",
    }),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery",
      jquery: "jquery",
    }),
    new CleanWebpackPlugin({ verbose: true }),
    new MiniCssExtractPlugin({
      filename: "[contenthash].css",
    }),
    /*
    new CopyPlugin({
      patterns: [{ from: "assets/font", to: "font" }],
    }),
    */
  ],
};
module.exports = (env, argv) => {
  let envv = {
    JS_PROD: process.env?.JS_PROD === "1" ? true : false,
  };
  conf_base.plugins.push(
    new webpack.DefinePlugin({
      "process.env": envv,
    }),
  );
  if (argv.mode === "production") {
    // conf_base.devtool = "eval-source-map";
    /*
    conf_base.plugins.push(
      new CompressionPlugin({
        algorithm: "gzip",
      }),
    );
    */
  } else {
    // conf_base.devtool = "source-map";
    conf_base.optimization.minimize = false;
    conf_base.plugins.push(
      new StatsWriterPlugin({
        filename: path.join("..", "stats", "log.json"),
        fields: null,
        stats: { chunkModules: true },
      }),
      new Visualizer({
        filename: path.join("..", "stats", "statistics.html"),
      }),
    );
  }
  return conf_base;
};
