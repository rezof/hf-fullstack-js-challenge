import React from 'react'
import Styled from 'styled-components'
import PropTypes from 'prop-types'

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

const ShopItemButtons = props => {
  const {
    shop_id,
    selectedShops,
    actionsHandlers: { dislikeShop, likeShop, unlikeShop }
  } = props

  if (selectedShops === 'near') {
    return [
      <DislikeBtn key="dislike" onClick={() => dislikeShop(shop_id)}>
        Dislike
      </DislikeBtn>,
      <LikeBtn key="like" onClick={() => likeShop(shop_id)}>
        Like
      </LikeBtn>
    ]
  } else if (selectedShops === 'preferred') {
    return (
      <RemoveBtn key="remove" onClick={() => unlikeShop(shop_id)}>
        remove
      </RemoveBtn>
    )
  }
  return null
}

ShopItemButtons.prototype = {
  shop_id: PropTypes.number.isRequired,
  selectedShops: PropTypes.string.isRequired,
  actionsHandlers: PropTypes.objectOf({
    dislikeShop: PropTypes.func.isRequired,
    likeShop: PropTypes.func.isRequired,
    unlikeShop: PropTypes.func.isRequired
  })
}

export default ShopItemButtons
