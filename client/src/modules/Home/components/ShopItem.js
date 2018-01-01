import * as React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

import ShopItemButtons from './ShopItemButtons'

const Wrapper = Styled.div`
  width: 20%;
  max-width: 250px;
  min-width: 100px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  margin: 0 2% 25px;
  border: 1px solid grey;
`

const Name = Styled.p`
  font-size: 16px;
  color: black;
  margin: 0;
  padding: 5px 0;
  font-family: sans-serif;
`

const ImageWrapper = Styled.div`
  flex: 1;
`

const Image = Styled.img`
  width: 100%;
`

const ButtonsWrapper = Styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
`

const ShopItem = props => {
  const {
    shop: { id, name, picture, distance },
    selectedShops,
    actionsHandlers
  } = props
  return (
    <Wrapper>
      <Name>{name}</Name>
      <ImageWrapper>
        <Image src={picture} />
      </ImageWrapper>
      <ButtonsWrapper>
        <ShopItemButtons
          shop_id={id}
          selectedShops={selectedShops}
          actionsHandlers={actionsHandlers}
        />
      </ButtonsWrapper>
    </Wrapper>
  )
}

const ShopShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  distance: PropTypes.number.isRequired
}

ShopItem.propTypes = {
  shop: PropTypes.shape(ShopShape),
  selectedShops: PropTypes.string.isRequired,
  actionsHandlers: PropTypes.object.isRequired
}

export default ShopItem
