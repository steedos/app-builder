import React, { useContext } from 'react';
import { Grid, GridItem, Flex, Box } from '@chakra-ui/layout'
import { observer } from "mobx-react-lite"

import ExpandableSection from '@salesforce/design-system-react/components/expandable-section';
import _ from 'lodash';

export const FieldSection = observer((props: any) => {
  const { 
    attributes, // Builder.io 传过来的参数。
    title, 
    columns = 2, 
    children 
  } = props
  
  const boxOptions = {
    templateColumns: [`repeat(1, 1fr)`, `repeat(${columns}, 1fr)`],
    gap: '0.5rem 2rem',
  }
  
  const renderChildren = (children:any) => {
    const result: any[] = []
    _.forEach(children, (child:any) => {
      result.push(child)
      return child
    })
    return (result)
  }

  return (
    <ExpandableSection
      id="default-expandable-section"
      title={title}
    >
      <Grid {...boxOptions}>
        {/* {renderChildren(children)} */}
        {children}
      </Grid>
    </ExpandableSection>
  )
})