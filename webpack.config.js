// it is node builtin module
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

const stylesHandler = MiniCssExtractPlugin.loader;


const isProduction = process.env.NODE_ENV == 'production';

config = {
    // entry: ['./src/assets/js/app', './src/assets/js/home-page'],
    // entry: ['./src/assets/ts/app', './src/assets/ts/home-page'],
    entry: { main: ['./src/assets/ts/app'], index: ['./src/assets/ts/home-page', './src/assets/ts/style'], styleSecond: ['./src/assets/ts/style']  },
    output: {
        // filename: 'bundle.js',
        filename: '[name].[hash].js',
        // note that the default output directory is the same but we write it for learning porpuse
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        // used to prevent file hashing:
        // assetModuleFilename: '[name].[hash].[ext]'
    },
    optimization: {
        minimize: isProduction,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserJSPlugin({}),
        ],
    },
    // the differences between production and development mode is about optimization
    // mode: 'production',
    // devtool: 'source-map',
    // devtool: 'inline-source-map',
    // devServer build assets will save in-memory
    devServer: {
        static: './dist',
        open: true,
        host: 'localhost',
        port: 8000,
        liveReload: true,
        watchFiles: ['./src/**/*']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                options: {
                    configFile: isProduction ? 'tsconfig.prod.json' : 'tsconfig.dev.json',
                },
                exclude: ['/node_modules/'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    minimize: isProduction,
                },
                exclude: ['/node_modules/'],
            },
            {
                // css-loader is for webpack to understand css
                // style-loader is for webpack to inject css in to js
                // so if you do not want to inject styles in to js remove style-loader
                test: /\.css$/i,
                // use: ['style-loader', 'css-loader'],
                use: [stylesHandler, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            config: path.resolve(__dirname, 'postcss.config.js'),
                        },
                    },
                }],
                exclude: ['/node_modules/'],
            },
            {
                test: /\.s[ac]ss$/i,
                // use: ['style-loader', 'css-loader', 'sass-loader'],
                use: [stylesHandler, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            config: path.resolve(__dirname, 'postcss.config.js'),
                        },
                    },
                }, 'sass-loader'],
                exclude: ['/node_modules/'],
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                // this will turn them to base64 and also we do not even need the generator
                // type: 'asset/inline',
                exclude: ['/node_modules/'],
                generator: {
                    filename: './assets/resource/[name][ext]'
                }
            },
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/app/index.html',
            filename: 'index.html',
            // inject: 'head',
            // chunks: ['main'],
        }),
        new HtmlWebpackPlugin({
            template: './src/app/home.html',
            filename: 'home.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css'
        }),
        new copyPlugin({
            patterns: [
                {
                    from: './src/assets/images',
                    to: './assets/images',
                },
                {
                    from: './src/assets/icons',
                    to: './assets/icons',
                },
                {
                    from: './src/libraries/js-libraries/**/*.js',
                    to: './assets/js/[name].js',
                },
            ]
        }),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
}

module.exports = () => {
    if (isProduction) {
        console.log('\x1b[41m production mode \x1b[0m');
        config.mode = 'production';
    } else {
        console.log('\x1b[41m development mode \x1b[0m');
        config.mode = 'development';
        config.devtool = 'inline-source-map';
    }
    return config;
};