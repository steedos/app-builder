// import React, {useContext} from "react";

// export { ObjectContext } from "@steedos/builder-object/src/index";

// export const SteedosContext = React.createContext<any>(null);

import React, {createContext} from "react";
import { types, Instance, onSnapshot } from "mobx-state-tree";
import {RootInstance} from "./Root";

export const RootStoreContext = createContext<null | RootInstance>(null);
