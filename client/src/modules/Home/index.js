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

const ErrorMsg = Styled.span`
  color: red;
  text-align: center;
  font-size: 14px;
`

const StatusMsg = ErrorMsg.extend`
  color: black;
`

class Home extends React.Component {
  state = {
    selectedShops: 'near',
    error: '',
    status: '',
    shops: {
      near: [],
      preferred: []
    }
  }

  componentWillMount() {
    this.likeShopHandler = this.likeShopHandler.bind(this)
    this.dislikeShopHandler = this.dislikeShopHandler.bind(this)
  }

  componentDidMount() {
    this.loadShops()
  }

  loadShops() {
    if ('geolocation' in navigator) {
      this.setState({ status: 'getting your location coordinates ...' })
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        this.setState({ status: 'loading shops' })
        makeRequest(`/api/shops?latitude=${latitude}&longitude=${longitude}`)
          .then(resp => {
            if (resp.status === 200) return resp.json()
            if (resp.status === 401) this.props.history.push('/login')
            else throw new Error('failed to load shops')
          })
          .then(dt => {
            if (dt && typeof dt.shops === 'object') {
              this.setState(state => {
                const { shops: { near = [], preferred = [] } } = dt
                state.shops = {
                  near,
                  preferred
                }
                state.status = ''
                state.error = ''
                return state
              })
            }
          })
          .catch(err => {
            console.log('failed to load shops')
            this.setState({ error: 'failed to load shops' })
          })
      })
    } else {
      // in a real world app we would do fallback
      this.setState({ error: 'could not get your location coordinates' })
    }
  }

  likeShopHandler(shop_id) {
    makeRequest(`/api/shop/like/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(state => {
            const result = state.shops.near.reduce(
              (acc, shop, i) => {
                if (shop.id === shop_id) {
                  acc['likedShop'] = shop
                  acc['index'] = i
                } else {
                  acc.nearShops.push(shop)
                }
                return acc
              },
              { nearShops: [], index: -1 }
            )
            const { nearShops, likedShop, index } = result
            // removed liked shop
            state.shops.near = nearShops
            // add liked shop to preferred shops
            state.shops.preferred.push(likedShop)
            // re-sort preferred shops
            state.shops.preferred = state.shops.preferred.sort(
              (a, b) => a.distance - b.distance
            )
            return state
          })
        }
      })
      .catch(err => {
        console.log('failed to like shop')
      })
  }

  unlikeShopHandler(shop_id) {
    makeRequest(`/api/shop/unlike/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(state => {
            const result = state.shops.preferred.reduce(
              (acc, shop, i) => {
                if (shop.id === shop_id) {
                  acc['unlikedShop'] = shop
                  acc['index'] = i
                } else {
                  acc.preferredShops.push(shop)
                }
                return acc
              },
              { preferred: [], index: -1 }
            )
            const { preferred, unlikedShop, index } = result

            // removed unliked shop
            state.shops.preferred = preferred
            // add unliked shop to near shops
            state.shops.near.push(unlikedShop)
            // re-sort near shops
            state.shops.near = state.shops.near.sort(
              (a, b) => a.distance - b.distance
            )
            return state
          })
        }
      })
      .catch(err => {
        console.log('failed to unlike shop')
      })
  }

  dislikeShopHandler(shop_id) {
    makeRequest(`/api/shop/dislike/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(state => {
            // filter out the disliked shop
            state.shops.near = state.shops.near.filter(
              shop => shop.id !== shop_id
            )
            return state
          })
        }
      })
      .catch(err => {
        console.log('failed to dislike shop')
      })
  }

  renderShopButtons(shop_id) {
    if (this.state.selectedShops === 'near') {
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

  render() {
    const { shops, selectedShops, error, status } = this.state
    return (
      <Container>
        <MenuBar>
          <MenuBarItem
            active={selectedShops === 'near'}
            onClick={() => this.setState({ selectedShops: 'near' })}
          >
            Near By Shops
          </MenuBarItem>
          <MenuBarItem
            onClick={() => this.setState({ selectedShops: 'preferred' })}
            active={selectedShops === 'preferred'}
          >
            My Preferred Shops
          </MenuBarItem>
        </MenuBar>
        <ContentWrapper>
          {!!error && <ErrorMsg>{error}</ErrorMsg>}
          {!error && !!status && <StatusMsg>{status}</StatusMsg>}
          {shops[selectedShops].map(shop => (
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
