module.exports = {
    entry: "./static/js/main.js",
    output: {
        path: __dirname + '/static/build/js/',
        filename: 'main.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
};
