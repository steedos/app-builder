import React from "react";
import { RootStoreContext } from "./Context";
import { rootStore } from "./Root";


export function StoreProvider(props: any) {

  const {
    initialState = {},
    children,
  } = props;
  rootStore.setInitialState(initialState);

  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  )
}