import path  from 'path';
import HtmlWebpackPlugin  from 'html-webpack-plugin';

import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const DIR_PATH_SRC_CLIENT = "./src-client";
const DIR_PATH_SRC_CLIENT_ADD_WORD = DIR_PATH_SRC_CLIENT + "/add-word";

export default {
  entry: DIR_PATH_SRC_CLIENT_ADD_WORD + '/index.js',
  output: {
    clean: true,
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
  },
  plugins: [new HtmlWebpackPlugin({
    template:  DIR_PATH_SRC_CLIENT_ADD_WORD + '/index.html',
    filename: "./index.html",
  })],
};
