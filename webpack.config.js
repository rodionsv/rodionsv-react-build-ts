const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const Paths = {
  SRC: path.join(__dirname, './src'),
  DIST: path.join(__dirname, './dist'),
  BUILD: path.join(__dirname, './build'),
  PUBLIC: path.join(__dirname, './public'),
  NODE_MODULES: path.join(__dirname, './node_modules'),
};

const config = {
  entry: {
    main: path.join(__dirname, 'src', 'index.tsx'),
  },
  output: {
    path: Paths.BUILD,
    filename: '[name].js',
    compareBeforeEmit: true
  },
  devServer: {
    contentBase: Paths.DIST,
    port: 3000,
    historyApiFallback: true,
    open: true,
    hot: true,
    https: true,
  },
  optimization: {},
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: 'source-map-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    modules: [Paths.SRC, Paths.NODE_MODULES],
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React webpack 5 build',
      template: `${Paths.PUBLIC}/index.html`,
      favicon: path.join(__dirname, 'public', 'favicon.ico'),
      filename: 'index.html',
      hash: true,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: Paths.PUBLIC,
          globOptions: {
            ignore: '*/index.html',
          },
          to: '',
        },
      ],
    }),
    new Dotenv({
      path: './.env',
      safe: true,
    })
  ],
  cache: {
    type: 'filesystem',
    store: 'pack',
  },
  parallelism: 100
};

module.exports = (env, argv) => {
  config.mode = argv.mode || 'development';

  const isDev = config.mode === 'development';
  const isServe = argv.env && argv.env.WEBPACK_SERVE || false;

  if (isDev) {
    config.devtool = 'source-map';
  }

  if (isServe) {
    config.output.path = Paths.DIST;
  }

  if (!isDev) {
    // internet explorer 11 support
    config.target = 'es5';
    config.optimization.minimize = true;
  }

  return config;
};
