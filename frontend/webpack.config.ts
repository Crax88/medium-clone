import { resolve, join } from "path";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

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
  return {
    mode: "development",
    entry: resolve(__dirname, "src", "index.tsx"),
    output: {
      path: resolve(__dirname, "dist"),
      filename: "bundle.js",
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
          use: ["style-loader", "css-loader"],
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
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve(__dirname, "./src/index.html"),
        title: "Conduit",
      }),
      new CleanWebpackPlugin(),
    ],
    devServer: {
      static: join(__dirname, "./src"),
      port: 3000,
      hot: true,
      compress: true,
      open: true,
    },
    stats: "errors-only",
    devtool: "cheap-module-source-map",
  };
}

export default webpackConfig;
