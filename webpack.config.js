var webpack = require('webpack');

module.exports = {

    entry: __dirname+"/src/main.js",

    output: {
        path: __dirname +"/dist/",
        filename: "Meme.js",
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.json$/,  loader: "json-loader"  },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },

};
