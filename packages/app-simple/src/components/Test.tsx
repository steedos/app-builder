import React, { useContext, useEffect, useState } from "react";
import { SteedosContext, ObjectContext } from "@steedos/builder-steedos/src";

import _ from "lodash";
import { useQuery } from "react-query";

export type TestProps = {};

export const Test = (props: TestProps) => {
  const objectContext = useContext(ObjectContext);

  const { ...rest } = props;

  const objectApiName = "space_users";
  const filters: any = [["name", "contains", "t"]];
  const fields: any = ["name"];
  const { isLoading, error, data, isFetching } = useQuery(
    objectApiName,
    async () => {
      return await objectContext.requestRecords(objectApiName, [], fields);
    }
  );
  
  const [t,setT]=useState(0)
  useEffect(() => {
    setT(Math.random())
  }, [data])
  useEffect(() => {
     console.log("T", t)
  },[t])
  
  console.log("Test data==", data);
  return (
    <div>
      {_.map(data, (item) => {
        return item.name;
      }).join(",")}
    </div>
  );
};
