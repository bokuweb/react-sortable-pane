const webpack = require('@cypress/webpack-preprocessor');

module.exports = on => {
  const options = {
    webpackOptions: {
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            include: [/cypress/],
            loader: require.resolve('ts-loader'),
          },
        ],
      },
    },
    watchOptions: {},
  };

  on('file:preprocessor', webpack(options));
};
