import React from 'react'
import styled from '@emotion/styled'
import Page from '../Page'
import { Spinner } from '@chakra-ui/react'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Spinner
      size='xl'
      />
    </Wrapper>
  )
}

export default PageLoader