import DeviceEventEmitter from '../plugins/DeviceEventEmitter';

let app_state = 'active';

DeviceEventEmitter.on('appStateDidChange', data => {
  app_state = data.app_state;
});

const AppState = {
  getCurrentAppState(callback, error) {
    Promise.resolve({ app_state }).then(callback);
  },

  __setAppState(appState) {
    DeviceEventEmitter.emit('appStateDidChange', { app_state: appState });
  },
};

module.exports = AppState;
