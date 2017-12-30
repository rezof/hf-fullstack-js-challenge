import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

import ShopItem from './components/ShopItem'

const Container = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
`

const MenuBar = Styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const MenuBarItem = Styled.span`
  font-size: 16px;
  color: skyblue;
  padding: 5px 10px;
  text-decoration: ${props => (props.active ? 'underline' : 'none')}
`

const ContentWrapper = Styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 0 5%;
`

const ShopContainer = Styled.div`
  width: 20%;
  border: 1px solid black;
`

class Home extends React.Component {
  state = {
    shops: []
  }

  componentWillMount() {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      this.props.history.push('/login')
    } else {
      this.access_token = access_token
    }
  }

  componentDidMount() {
    this.loadShops()
  }

  loadShops() {
    fetch('//localhost:4000/shops', {
      headers: {
        Authorization: this.access_token
      },
      accept: 'application/json'
    })
      .then(result => result.json())
      .then(({ shops = [] }) => {
        this.setState({ shops })
      })
      .catch(err => this.setState({ error: 'failed to load shops' }))
  }

  render() {
    return (
      <Container>
        <MenuBar>
          <MenuBarItem>Near By Shops</MenuBarItem>
          <MenuBarItem>My Preffered Shops</MenuBarItem>
        </MenuBar>
        <ContentWrapper>
          {this.state.shops.map(shop => <ShopItem key={shop.id} shop={shop} />)}
        </ContentWrapper>
      </Container>
    )
  }
}

Home.propTypes = {
  history: PropTypes.object.isRequired
}

export default Home
