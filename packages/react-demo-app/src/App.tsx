import React from 'react';
import logo from './logo.svg';
import './App.css';

import { SteedosProvider } from "@steedos/builder-steedos"
import { ObjectTree, UserPicker } from "@steedos/builder-object"

function App() {
   const handleOnChange = (users: any) => {
     console.log(users)
     // setSelectedEmails(users.map(({ name, email }) => `${name}<${email}>`))
   }
  return (
    <SteedosProvider>
      <div className="App">
        <UserPicker
          includeSub={true}
          onChange={handleOnChange}
          treeProps={{
            objectApiName: "organizations",
            style: { width: "100%" },
            defaultExpandAll: true,
            onChange: (values: any) => {
              console.log(values)
            },
          }}
          tableProps={{
            objectApiName: "space_users",
            columnFields: [
              {
                fieldName: "name",
              },
              {
                fieldName: "email",
              },
            ],
          }}
        ></UserPicker>
      </div>
    </SteedosProvider>
  )
}

export default App;
