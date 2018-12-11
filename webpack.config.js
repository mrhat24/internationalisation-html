var path = require('path');

module.exports = function () {
    return {
        entry: './src/index.ts',
        output: {
            filename: "translator.bundle.js",
            path: path.resolve(__dirname, 'dist'),
            library: 'Translator',
            libraryExport: "Translator",
            libraryTarget: "var"
        },
        devtool: "source-map",
        resolve: {
            extensions: ['.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        target: "web"
    }
};
