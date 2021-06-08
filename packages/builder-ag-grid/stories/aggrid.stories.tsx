import { ObjectGrid} from "@steedos/builder-ag-grid";
import * as React from "react"
export default {
  title: "Object Table AG Grid",
}

export const Grid = () => {
  return (
      <ObjectGrid objectApiName='accounts' 
        pagination={{
          pageSize:3
        }}
        sort="created desc,name desc"
        // rowSelection="single"
        columnFields={
          [
            {
              fieldName: 'name'
            },
            {
              fieldName: 'parent_id'
            },
            {
              fieldName: 'rating'
            },
            {
              fieldName: 'type'
            },
            {
              fieldName: 'created'
            },
            {
              fieldName: 'created_by'
            },
          ]
        }
      >
        
      </ObjectGrid>
  )
}
