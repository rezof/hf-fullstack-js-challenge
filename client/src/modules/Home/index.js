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

const ContentWrapper = Styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 5%;
`

const ShopContainer = Styled.div`
  width: 20%;
  border: 1px solid black;
`

class Home extends React.Component {
  state = {
    display: 'preferred',
    shops: {
      near: [],
      preferred: []
    }
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
      .then(dt => {
        if (dt.hasOwnProperty('shops')) {
          this.setState(state => {
            const { shops: { near = [], preferred = [] } } = dt
            state.shops = {
              near,
              preferred
            }
            return state
          })
        }
      })
      .catch(err => this.setState({ error: 'failed to load shops' }))
  }

  render() {
    const { shops, display } = this.state
    return (
      <Container>
        <MenuBar>
          <MenuBarItem
            active={display === 'near'}
            onClick={() => this.setState({ display: 'near' })}
          >
            Near By Shops
          </MenuBarItem>
          <MenuBarItem
            onClick={() => this.setState({ display: 'preferred' })}
            active={display === 'preferred'}
          >
            My Preferred Shops
          </MenuBarItem>
        </MenuBar>
        <ContentWrapper>
          {shops[display].map(shop => <ShopItem key={shop.id} shop={shop} />)}
        </ContentWrapper>
      </Container>
    )
  }
}

Home.propTypes = {
  history: PropTypes.object.isRequired
}

export default Home
