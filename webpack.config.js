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
    entry: { main: ['./src/assets/ts/main', './src/assets/ts/style'] },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        minimize: isProduction,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserJSPlugin({}),
        ],
    },
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
                test: /\.css$/i,
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
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/app/index.html',
            filename: 'index.html',
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
            ]
        }),
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