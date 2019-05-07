# theglue-isc-react-library

React components to integrate the Identity Service Component based on KeyCloak.

Consists of:

- Login component: authenticate via Keycloak and start a new session
- Logout component: terminate an ongoing session
- Private Route component: check the user token for private routes and refreshes the token if necessary

# Installation

`npm install --save theglue-isc-react-library`

# Usage

Mount the login, logout and Private route components anywhere in your application. Assign the following function props to the components:

- Login: userLoggedIn
- Logout: userLoggedOut
- PrivateRoute: userLoggedIn

```
import { Login, Logout, PrivateRoute } from "@theglue/isc-react-library/build";

class App extends Component {
  render() {
    return (
        <Router>
          <div>
              <Switch>
                <Route path="/log-in" render={() => <Login userLoggedIn={this.props.userLoggedIn} />} />
                <Route path="/log-out" render={() => <Logout userLoggedOut={this.props.userLoggedOut} />} />
                <Route exact path="/" component={Home} />
                <PrivateRoute path="/authenticated-only" component={AuthenticatedOnly} userLoggedIn={this.props.userLoggedIn} />
              </Switch>
            </div>
          </div>
        </Router>
    );
  }
}
```

To dispatch the function to the store you can do the following:

```
const mapDispatchToProps = (dispatch) =>{
  return {
    userLoggedIn: (loggedIn, token) => dispatch(userLoggedIn(loggedIn, token)),
    userLoggedOut: () => dispatch(userLoggedOut())
  };
}

```

As you can see the userLoggedIn will return a boolean and a token. This token can be used for further calls to backends. The boolean is a flag that can be stored in a reducer.

## Examples:

**reducer.js**

```
function user(state = { isAuthenticated: false }, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
    console.log(action);
      axios.defaults.headers.common.Authorization = `Bearer ${action.token}`;
      return {
        ...state,
        isAuthenticated: action.isAuthenticated
      };
    case USER_LOGGED_OUT:
    console.log(action);
      axios.defaults.headers.common.Authorization = "";
      return {
        ...state,
        isAuthenticated: action.isAuthenticated
      };
    default:
      return state;
  }
}
```

**actions.js**

```
export function userLoggedIn(loggedIn, token) {
  return {
    type: USER_LOGGED_IN,
    isAuthenticated: loggedIn,
    token
  };
}

export function userLoggedOut() {

  return {
    type: USER_LOGGED_OUT,
    isAuthenticated: false
  };
}
```

# Contribution

Create a pull request for every change. Make sure unit tests are written and working, run lint and rebuild your files.
