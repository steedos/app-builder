import { observer } from "mobx-react-lite";
import { SteedosAppLauncher } from "@steedos/builder-lightning";

export const Apps = observer((props: any) => {
  return (<SteedosAppLauncher {...props}/>)
});