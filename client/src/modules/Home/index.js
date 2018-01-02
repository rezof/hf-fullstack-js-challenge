import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'
import NotificationSystem from 'react-notification-system'

import { ShopItem, MenuBar } from './components'
import { makeRequest, getCurrentPosition } from '../../utils'

const Container = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  justify-content: center;
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
    selectedShops: 'near',
    shops: {
      near: [],
      preferred: []
    }
  }

  componentDidMount() {
    this.loadShops()
  }

  displayNotification({ message, level }) {
    this.refs.notificationSystem.addNotification({
      message,
      level,
      position: 'br'
    })
  }

  positionSuccess(position) {
    const { latitude, longitude } = position.coords
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
            return state
          })
        }
      })
      .catch(err => {
        this.displayNotification({
          message: 'failed to load shops',
          level: 'error'
        })
      })
  }

  positionError() {
    this.displayNotification({
      message: 'could not get your location coordinates',
      level: 'error'
    })
  }

  loadShops() {
    if ('geolocation' in navigator) {
      this.displayNotification({
        message: 'getting your location coordinates ...',
        level: 'info'
      })
      getCurrentPosition(
        position => this.positionSuccess(position), // success callback
        this.positionError // error callback
      )
    } else {
      // in a real world app we would do fallback
      this.displayNotification({
        message: 'could not get your location coordinates',
        level: 'error'
      })
    }
  }

  likeShopHandler(shop_id) {
    makeRequest(`/api/shop/like/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(
            state => {
              const result = state.shops.near.reduce(
                /*
                  data: the accumulated object
                  shop: the currently iterated shop
                */
                (data, shop) => {
                  if (shop.id === shop_id) {
                    data['likedShop'] = shop
                  } else {
                    data.nearShops.push(shop)
                  }
                  return data
                },
                { nearShops: [], likedShop: {} } // initial data value
              )
              const { nearShops, likedShop } = result

              // near shops left
              state.shops.near = nearShops
              // add liked shop to preferred shops
              state.shops.preferred.push(likedShop)
              // re-sort preferred shops
              state.shops.preferred = state.shops.preferred.sort(
                (a, b) => a.distance - b.distance
              )
              return state
            },
            () => {
              this.displayNotification({
                message: 'shop liked',
                level: 'success'
              })
            }
          )
        }
      })
      .catch(err => {
        this.displayNotification({
          message: 'failed to like the shop',
          level: 'error'
        })
      })
  }

  unlikeShopHandler(shop_id) {
    makeRequest(`/api/shop/unlike/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(
            state => {
              const result = state.shops.preferred.reduce(
                /*
                  data: the accumulated object
                  shop: the currently iterated shop
                */
                (data, shop) => {
                  if (shop.id === shop_id) {
                    data['unlikedShop'] = shop
                  } else {
                    data.preferredShops.push(shop)
                  }
                  return data
                },
                { preferredShops: [], unlikedShop: {} } // initial data value
              )
              const { preferredShops, unlikedShop, index } = result

              // preferred shops left
              state.shops.preferred = preferredShops
              // add unliked shop to near shops
              state.shops.near.push(unlikedShop)
              // re-sort near shops
              state.shops.near = state.shops.near.sort(
                (a, b) => a.distance - b.distance
              )
              return state
            },
            () => {
              this.displayNotification({
                message: 'shop removed',
                level: 'success'
              })
            }
          )
        }
      })
      .catch(err => {
        this.displayNotification({
          message: 'failed to remove the shop',
          level: 'error'
        })
      })
  }

  dislikeShopHandler(shop_id) {
    makeRequest(`/api/shop/dislike/${shop_id}`, { method: 'post' })
      .then(dt => dt.json())
      .then(resp => {
        if (resp.success) {
          this.setState(
            state => {
              // filter out the disliked shop
              state.shops.near = state.shops.near.filter(
                shop => shop.id !== shop_id
              )
              return state
            },
            () => {
              this.displayNotification({
                message: 'shop disliked',
                level: 'success'
              })
            }
          )
        }
      })
      .catch(err => {
        this.displayNotification({
          message: 'failed to dislike the shop',
          level: 'error'
        })
      })
  }

  render() {
    const { shops, selectedShops } = this.state
    const actionsHandlers = {
      dislikeShop: this.dislikeShopHandler.bind(this),
      unlikeShop: this.unlikeShopHandler.bind(this),
      likeShop: this.likeShopHandler.bind(this)
    }
    return (
      <Container>
        <MenuBar
          history={this.props.history}
          selectedShops={selectedShops}
          changeSelected={selected =>
            this.setState({ selectedShops: selected })
          }
        />
        <ContentWrapper>
          {shops[selectedShops].map(shop => (
            <ShopItem
              key={shop.id}
              shop={shop}
              selectedShops={selectedShops}
              actionsHandlers={actionsHandlers}
            />
          ))}
        </ContentWrapper>
        <NotificationSystem ref="notificationSystem" />
      </Container>
    )
  }
}

Home.propTypes = {
  history: PropTypes.object.isRequired
}

export default Home
