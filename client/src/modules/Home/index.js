import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

import ShopItem from './components/ShopItem'
import { makeRequest } from '../../utils'

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

const Button = Styled.div`
color: white;
font-size: 14px;
padding: 5px 8px;
cursor: pointer;
&:last-of-type{
  margin-left: 10px;
}
`

const LikeBtn = Button.extend`
  background-color: green;
`

const DislikeBtn = Button.extend`
  background-color: red;
`

const RemoveBtn = DislikeBtn

class Home extends React.Component {
  state = {
    display: 'preferred',
    shops: {
      near: [],
      preferred: []
    }
  }

  componentWillMount() {
    this.likeShopHandler = this.likeShopHandler.bind(this)
    this.dislikeShopHandler = this.dislikeShopHandler.bind(this)
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
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        makeRequest(
          `//localhost:4000/shops?latitude=${latitude}&longitude=${longitude}`
        )
          .then(result => result.json())
          .then(dt => {
            if (dt && typeof dt.shops === 'object') {
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
      })
    }
  }

  renderShopButtons(shop_id) {
    if (this.state.display === 'near') {
      return [
        <DislikeBtn
          key="dislike"
          onClick={() => this.dislikeShopHandler(shop_id)}
        >
          Dislike
        </DislikeBtn>,
        <LikeBtn key="like" onClick={() => this.likeShopHandler(shop_id)}>
          Like
        </LikeBtn>
      ]
    } else {
      return (
        <RemoveBtn key="remove" onClick={() => this.unlikeShopHandler(shop_id)}>
          remove
        </RemoveBtn>
      )
    }
  }

  likeShopHandler(shop_id) {
    makeRequest(`//localhost:4000/shop/like/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(state => {
            const { near, shop: likedShop, index } = state.shops.near.reduce(
              (acc, shop, i) => {
                if (shop.id === shop_id) {
                  acc['shop'] = shop
                  acc['index'] = i
                } else {
                  acc.near.push(shop)
                }
                return acc
              },
              { near: [], index: -1 }
            )
            state.shops.preferred.push(likedShop)
            state.shops.preferred.sort((a, b) => a.distance > b.distance)
            delete state.shops.near[index]
            return state
          })
        }
      })
  }

  unlikeShopHandler(shop_id) {
    makeRequest(`//localhost:4000/shop/unlike/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(state => {
            const {
              preferred,
              shop: unlikedShop,
              index
            } = state.shops.preferred.reduce(
              (acc, shop, i) => {
                if (shop.id === shop_id) {
                  acc['shop'] = shop
                  acc['index'] = i
                } else {
                  acc.near.push(shop)
                }
                return acc
              },
              { near: [], index: -1 }
            )
            state.shops.near.push(unlikedShop)
            state.shops.near.sort((a, b) => a.distance > b.distance)
            delete state.shops.preferred[index]
            return state
          })
        }
      })
  }

  dislikeShopHandler(shop_id) {
    makeRequest(`//localhost:4000/shop/dislike/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(state => {
            state.shops.near = state.shops.near.filter(
              shop => shop.id !== shop_id
            )
            return state
          })
        }
      })
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
          {shops[display].map(shop => (
            <ShopItem key={shop.id} shop={shop}>
              {this.renderShopButtons(shop.id)}
            </ShopItem>
          ))}
        </ContentWrapper>
      </Container>
    )
  }
}

Home.propTypes = {
  history: PropTypes.object.isRequired
}

export default Home
