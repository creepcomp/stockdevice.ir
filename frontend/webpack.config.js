module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|woff2)$/,
                type: "asset/resource",
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
};
