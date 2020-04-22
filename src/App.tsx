import React from 'react';
import './assets/stylesheets/App.scss';
import SignInPage from './containers/SignInPage';
import { Switch, Router, Route } from 'react-router-dom'
import history from './history'
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import MainPage from './containers/MainPage';
import ForgotPassword from './containers/ForgotPassword';
import PasswordReset from './containers/PasswordReset';
import AgreementPage from './containers/AgreementPage';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Noto Sans KR",
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    type: 'dark',
    primary: {
      "500": '#01babc'
    },
  },
  overrides: {
    MuiFormLabel: {
      root: {
        color: '#ffffff'
      }
    },
    MuiInputBase: {
      root: {
        input: {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiInput: {
      root: {
        underline: {
          borderBottomColor: 'red'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Switch>
          <Route path="/password/reset/:token" component={PasswordReset} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/agreement" component={AgreementPage} />
          <Route component={MainPage} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
