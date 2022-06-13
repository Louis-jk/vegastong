/**
 * @format
 */
import React from 'react';
import App from './App';
import {AppRegistry, Text, TextInput} from 'react-native';
import {name as appName} from './app.json';
import rootReducer from './Screens/Module/';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const store = createStore(rootReducer, composeWithDevTools());

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
