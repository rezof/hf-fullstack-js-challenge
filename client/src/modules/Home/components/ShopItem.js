import * as React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

const Wrapper = Styled.div`
  width: 20%;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  margin-bottom: 25px;
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

const Button = Styled.div`
  color: white;
  font-size: 14px;
  padding: 5px 8px;
  &:last-of-type {
    margin-left: 10px;
  }
`

const LikeBtn = Button.extend`
  background-color: green;
`

const DislikeBtn = Button.extend`
  background-color: red;
`

const ShopItem = props => {
  const { shop: { id, name, picture, distance } } = props
  return (
    <Wrapper>
      <Name>{name}</Name>
      <ImageWrapper>
        <Image src={picture} />
      </ImageWrapper>
      <ButtonsWrapper>
        <DislikeBtn>Dislike</DislikeBtn>
        <LikeBtn>Like</LikeBtn>
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
  shop: PropTypes.shape(ShopShape)
}

export default ShopItem
