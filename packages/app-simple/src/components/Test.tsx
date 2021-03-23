import React, { useContext } from "react";
import { SteedosContext, ObjectContext } from "@steedos/builder-steedos/src";
import { ObjectTable } from "@steedos/builder-object/src";

import _ from 'lodash';
import { useQuery } from "react-query";

export type TestProps = {

}

export const Test = (props: TestProps) => {
  const objectContext = useContext(ObjectContext);

  const { ...rest } = props

  const objectApiName = "space_users";
  const filters: any = [["name", "contains", "t"]];
  const fields: any = ["name"];
  const {
    isLoading,
    error,
    data,
    isFetching
  } = useQuery(objectApiName, async () => {
    let result = await objectContext.requestRecords(objectApiName, filters, fields);
    return result.value;
  });
  console.log("Test data==", data);
  return (
    <div>
      <span>
        {_.map(data, (item)=>{return item.name}).join(",")}
      </span>
      <ObjectTable
        name="test"
        objectApiName="accounts"
        columnFields={[{
          fieldName: "name"
        }, {
          fieldName: "is_customer"
        }]}
      />
    </div>
  )
};