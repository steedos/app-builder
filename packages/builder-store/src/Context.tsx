import React, {createContext} from "react";
import {RootInstance} from "./Root";

export const RootStoreContext = createContext<null | RootInstance>(null);
