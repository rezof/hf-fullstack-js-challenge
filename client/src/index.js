import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import Styled from 'styled-components'
import Home from './modules/Home'
import { Login, Register } from './modules/Auth'

const RoutesWrapper = Styled.div`
  height: 100vh;
`

// if token is set return home component
// if not redirect to /login
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      component={props => {
        return localStorage.getItem('token') ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }}
    />
  )
}

export default () => {
  return (
    <Router>
      <RoutesWrapper>
        <PrivateRoute exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Register} />
      </RoutesWrapper>
    </Router>
  )
}
