import React from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

const Container = Styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 25px;
  box-sizing: border-box;
`

const MenuBarItem = Styled.span`
  font-size: 16px;
  color: skyblue;
  padding: 5px 10px;
  cursor: pointer;
  text-decoration: ${props => (props.active ? 'underline' : 'none')}
`

const Logout = Styled.span`
  font-size: 16px;
  color: #b7b7b7;
  padding: 5px 15px;
  cursor: pointer;
  border-left: 1px solid lightgrey;
`

const MenuBar = ({ selectedShops, changeSelected, history }) => {
  return (
    <Container>
      <MenuBarItem
        active={selectedShops === 'near'}
        onClick={() => changeSelected('near')}
      >
        Near By Shops
      </MenuBarItem>
      <MenuBarItem
        onClick={() => changeSelected('preferred')}
        active={selectedShops === 'preferred'}
      >
        My Preferred Shops
      </MenuBarItem>
      <Logout onClick={() => history.push('/logout')}>logout</Logout>
    </Container>
  )
}

MenuBar.propTypes = {
  history: PropTypes.object.isRequired,
  selectedShops: PropTypes.string.isRequired,
  changeSelected: PropTypes.func.isRequired
}

export default MenuBar
