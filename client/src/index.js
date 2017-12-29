import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Home from './modules/Home'
import { Login, Register } from './modules/Auth'

export default () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Register} />
      </div>
    </Router>
  )
}
