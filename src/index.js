module.exports = {
    get NetworkProvider() {
      return require('./components/NetworkProvider').default;
    },
    get NetworkConsumer() {
      return require('./components/NetworkConsumer').default;
    },
    get checkInternetConnection() {
      return require('./utils/checkInternetConnection').default;
    },
  };