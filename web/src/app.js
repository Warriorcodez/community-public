import allReducers from './reducers/index';
import { createStore } from 'redux';
import { deepOrange500 } from 'material-ui/styles/colors';
import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import Homepage from './containers/Homepage';
import Profile from './containers/Profile';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
//test

const store = createStore(allReducers);

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  },
});

const styles = {
  theme: {
    fontFamily: 'Vibur'
  }
};

injectTapEventPlugin();
if (document.getElementById('root')) {
  ReactDOM.render(
    <Provider store={store} >
      <MuiThemeProvider muiTheme={muiTheme} fontFamily={'Vibur'}>
        <Homepage />
      </MuiThemeProvider>
    </Provider>, document.getElementById('root'));
}

if (document.getElementById('profile')) {
  ReactDOM.render(
    <Provider store={store} >
      <MuiThemeProvider muiTheme={muiTheme} fontFamily={'Vibur'}>
        <Profile />
      </MuiThemeProvider>
    </Provider>, document.getElementById('profile'));
}
