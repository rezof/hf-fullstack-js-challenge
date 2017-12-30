import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

const Container = Styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`

const FormWrapper = Styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  max-width: 400px;
  padding: 50px;
  border: 1px solid lightgrey;
  border-radius: 10px;
  box-shadow: 2px 2px 10px #0000002b;
`

const LoginTitle = Styled.p`
  color: grey;
  text-align: center;
  margin-bottom: 15px;
  font-size: 24px;
`

const Form = Styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Input = Styled.input`
  height: 40px;
  font-size: 18px;
  padding-left: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  margin-bottom: 8px;
`

const Submit = Input.extend`
  background-color: papayawhip;
  color: black;
`

const ErrorMsg = Styled.span`
  color: red;
  font-size: 16px;
  text-align: center;
`

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      loginErrors: []
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  login(payload) {
    fetch('//localhost:4000/login', {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then(rslt => rslt.json())
      .then(data => {
        if (!data.success) {
          const { errors = [] } = data
          this.setState(state => {
            state.loginErrors = errors.length ? errors : ['failed to login']
            return state
          })
        } else {
          localStorage.setItem('access_token', data.token)
          this.props.history.push('/')
        }
      })
      .catch(err => console.error('login failed', err))
  }

  handleFormSubmit(e) {
    e.preventDefault()
    const payload = {
      email: this._email.value,
      password: this._password.value
    }
    this.setState({ loginErrors: [] }, () => this.login(payload))
  }

  render() {
    const { loginErrors } = this.state
    return (
      <Container>
        <FormWrapper>
          <LoginTitle>Login</LoginTitle>
          <Form onSubmit={this.handleFormSubmit}>
            <Input
              innerRef={ref => (this._email = ref)}
              type="email"
              placeholder="email"
              required
            />
            <Input
              innerRef={ref => (this._password = ref)}
              type="password"
              placeholder="passowrd"
              required
              minLength="4"
            />
            <Submit type="submit" value="login" />
            {!!loginErrors.length &&
              loginErrors.map((error, i) => (
                <ErrorMsg key={i}>{error}</ErrorMsg>
              ))}
          </Form>
        </FormWrapper>
      </Container>
    )
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired
}

export default Login
