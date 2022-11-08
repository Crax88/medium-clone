import { resolve, join } from "path";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

export interface WebpackConfiguration extends Configuration {
  devServer?: DevServerConfiguration;
}

type CLIValues = boolean | string;

type EnvValues = Record<string, CLIValues | Record<string, Env>>;

interface Env extends EnvValues {}

type Argv = Record<string, CLIValues>;

export interface WebpackConfigurationGenerator {
  (env?: Env, argv?: Argv): Configuration | Promise<Configuration>;
}

function webpackConfig(env: Env, argv: Argv): WebpackConfiguration {
  const isDevMode = env.env && env.env === "development";

  process.env.NODE_ENV = isDevMode ? "development" : "production";

  return {
    mode: isDevMode ? "development" : "production",
    entry: resolve(__dirname, "src", "index.tsx"),
    output: {
      path: resolve(__dirname, "dist"),
      filename: isDevMode ? "[name].js" : "[name].[contenthash:8].js",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    devServer: {
      static: join(__dirname, "./src"),
      port: 3000,
      hot: true,
      compress: true,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: "asset/inline",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve(__dirname, "./src/index.html"),
        title: "Conduit",
      }),
      new CleanWebpackPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: "disabled",
        generateStatsFile: true,
        statsFilename: "../stats.json",
      }),
      new MiniCssExtractPlugin({
        filename: "styles/[name].[hash].css",
      }),
    ],
    stats: "errors-warnings",
    devtool: isDevMode ? "cheap-module-source-map" : "source-map",
    performance: {
      hints: "warning",
      maxAssetSize: 100 * 1024,
      maxEntrypointSize: 100 * 1024,
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin()],
      moduleIds: "hashed",
      runtimeChunk: {
        name: "manifest",
      },
      minimize: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
          },
          common: {
            name: "components",
            test: /[\\/]src[\\/]components[\\/]/,
            chunks: "all",
            minSize: 0,
          },
        },
      },
    },
  };
}

export default webpackConfig;
