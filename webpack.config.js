const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: path.resolve(__dirname, "src/app.tsx"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name].[contenthash].js" : "[name].js",
      clean: true,
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
      }),
      new Dotenv({ safe: true, allowEmptyValues: false }),
    ],

    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",

    devServer: {
      static: { directory: path.resolve(__dirname, "dist") },
      port: 3000,
      hot: true,
      historyApiFallback: true,
      open: true,
    },
  };
};