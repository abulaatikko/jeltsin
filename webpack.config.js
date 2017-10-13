module.exports = options => {
  return {
    entry: './front/index.js',
    output: {
      filename: 'web/bundle.js',
    },
    module: {
      rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
      ],
    },
  }
}
