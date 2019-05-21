import React from 'react';
import { Redirect } from 'react-router-dom';
import KeycloakContext from '../KeycloakContext';
import { getKeycloak } from '../keycloak';

class Login extends React.Component {
  static contextType = KeycloakContext;

  state = { isLoading: true };

  componentDidMount() {
    this.logIn();
  }

  logIn = () => {
    const keycloak = getKeycloak();
    if (!keycloak.authenticated) {
      try {
        keycloak
          .init({ onLoad: 'login-required', checkLoginIframe: false })
          .success(() => {
            this.setState({ isLoading: false });
            this.props.onSuccess(keycloak.token);
          })
          .error(() => {
            this.props.onFailure('there was an error with initializing keycloak, please check your credentials');
          });
      } catch (e) {
        this.props.onFailure(e);
      }
    }
  };

  render() {
    const keycloak = getKeycloak();
    if (!keycloak.token && this.state.isLoading) {
      // fallback to check if initialization of Keycloak is finished.
      return <p>Loading...</p>;
    }
    return (
      // redirect to the assigned path in the props
      <Redirect
        to={{
          pathname: this.props.redirectTo
        }}
      />
    );
  }
}

export default Login;
