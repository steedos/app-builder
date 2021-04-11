import { createContext, useContext } from "react"
import { RootStore, rootStore } from "./Root"

/**
 * Create a context we can use to
 * - Provide access to our stores from our root component
 * - Consume stores in our screens (or other components, though it's
 *   preferable to just connect screens)
 */
const RootStoreContext = createContext<RootStore>(rootStore)

/**
 * The provider our root component will use to expose the root store
 */
export const StoreProvider = RootStoreContext.Provider

/**
 * A hook that screens can use to gain access to our stores, with
 * `const { someStore, someOtherStore } = useStores()`,
 * or less likely: `const rootStore = useStores()`
 */
// export const useStore = () => useContext(RootStoreContext)