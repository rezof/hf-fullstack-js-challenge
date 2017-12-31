import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'
import { Link } from 'react-router-dom'
import Form from './components/Form'
import { makeRequest } from '../../utils'

const Container = Styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`

const ContentWrapper = Styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  max-width: 400px;
  padding: 50px;
  border: 1px solid lightgrey;
  border-radius: 10px;
  box-shadow: 2px 2px 10px #0000002b;
`

const Input = Styled.input`
  height: 40px;
  font-size: 18px;
  padding-left: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  margin-bottom: 8px;
`

const ErrorMsg = Styled.span`
  color: red;
  font-size: 16px;
  text-align: center;
`

const Goto = Styled(Link)`
  color: grey;
  font-size: 16px;
  text-align: right;
  text-decoration: none;
`

class Register extends React.Component {
  state = {
    errors: []
  }

  signup(payload) {
    makeRequest(
      '/api/register',
      {
        method: 'post',
        body: JSON.stringify(payload),
        headers: {
          'content-type': 'application/json'
        }
      },
      false // disable authorization header
    )
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

  formSubmitHandler() {
    return e => {
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
  }

  renderFormInputs() {
    return () => {
      return [
        <Input
          key="email"
          innerRef={ref => (this._email = ref)}
          type="email"
          placeholder="email"
          required
        />,
        <Input
          key="password"
          innerRef={ref => (this._password = ref)}
          type="password"
          placeholder="passowrd"
          minLength="4"
          required
        />,
        <Input
          key="passwordConf"
          innerRef={ref => (this._passwordConf = ref)}
          type="password"
          placeholder="passowrd confirmation"
          minLength="4"
          required
        />
      ]
    }
  }

  render() {
    const { errors } = this.state
    return (
      <Container>
        <ContentWrapper>
          <Form
            title="Register"
            submitHandler={this.formSubmitHandler()}
            submitValue="sign up"
            inputs={this.renderFormInputs()}
          />
          <Goto to="/login">already have a account ?</Goto>
          {!!errors.length &&
            errors.map((error, i) => <ErrorMsg key={i}>{error}</ErrorMsg>)}
        </ContentWrapper>
      </Container>
    )
  }
}

Register.propTypes = {
  history: PropTypes.object.isRequired
}

export default Register
