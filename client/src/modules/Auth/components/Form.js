import React from 'react'
import Styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = Styled.div`
  flex: 1;
`

const Title = Styled.p`
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

const FormComponent = ({
  title,
  submitHandler,
  inputs,
  submitValue = 'Submit'
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Form onSubmit={submitHandler}>
        {inputs()}
        <Submit type="submit" value={submitValue} />
      </Form>
    </Container>
  )
}

FormComponent.propTypes = {
  title: PropTypes.string,
  submitHandler: PropTypes.func,
  inputs: PropTypes.func,
  submitValue: PropTypes.string
}

export default FormComponent
