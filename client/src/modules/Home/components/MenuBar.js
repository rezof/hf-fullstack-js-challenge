import React from 'react'
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

const MenuBar = ({ selectedShops, changeSelected }) => {
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
    </Container>
  )
}

MenuBar.propTypes = {
  selectedShops: PropTypes.string.isRequired,
  changeSelected: PropTypes.func.isRequired
}

export default MenuBar
