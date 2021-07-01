import React, { useState } from "react"
import { filter } from 'lodash';
import { API } from "@steedos/builder-store"
import Dropdown from '@salesforce/design-system-react/components/menu-dropdown'; 

export const AgGridRowActions = (props: any) => {
  const {rowButtons, objectApiName, data} = props;
  const [options, setOptions] = useState([]);
  const getDropdownOptions = ()=>{
    const result = filter(rowButtons, (button)=>{
      return API.client.action.calculationVisible(objectApiName, button, data, {
        userId: API.client.getUserId(),
        spaceId: API.client.getSpaceId(),
      })
    });
    if(result.length){
      return result;
    }
    else{
      return [{ label: "没有可做的操作", todo: null, }];
    }
  }

  return (
    <Dropdown
      assistiveText={{ icon: 'Options' }}
      iconCategory="utility"
      iconName="down"
      iconVariant="border-filled"
      iconSize='x-small'
      width='x-small'
      menuPosition="overflowBoundaryElement"
      onSelect={(option) => {
        try {
          if(!option || !option.todo){
            return;
          }
          API.client.action.executeAction(objectApiName, option, data._id, null, null, data)
        } catch (error) {
          console.error(`executeAction error`, error)
        }
      }}
      options={options}
      onOpen={() => {
        if(!options.length){
          const dropdownOptions = getDropdownOptions();
          setOptions(dropdownOptions);
        }
      }}
    />
  )
}