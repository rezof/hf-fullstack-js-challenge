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

class Register extends React.Component {
  constructor() {
    super()
    this.state = {
      errors: []
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  signup(payload) {
    fetch('//localhost:4000/register', {
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
            state.errors = errors.length ? errors : ['failed to login']
            return state
          })
        } else {
          this.props.history.push('/login')
        }
      })
      .catch(err => console.error('login failed', err))
  }

  handleFormSubmit(e) {
    e.preventDefault()
    const payload = {
      email: this._email.value,
      password: this._password.value,
      passwordConf: this._passwordConf.value
    }
    const errors = []
    if (payload.password !== payload.passwordConf) {
      errors.push("passwords don't match")
    }
    this.setState({ errors }, state => {
      if (errors.length === 0) this.signup(payload)
    })
  }

  render() {
    const { errors } = this.state
    return (
      <Container>
        <FormWrapper>
          <LoginTitle>Register</LoginTitle>
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
              minLength="4"
              required
            />
            <Input
              innerRef={ref => (this._passwordConf = ref)}
              type="password"
              placeholder="passowrd confirmation"
              minLength="4"
              required
            />
            <Submit type="submit" value="sign up" />
            {!!errors.length &&
              errors.map((error, i) => <ErrorMsg key={i}>{error}</ErrorMsg>)}
          </Form>
        </FormWrapper>
      </Container>
    )
  }
}

Register.propTypes = {
  history: PropTypes.object.isRequired
}

export default Register
