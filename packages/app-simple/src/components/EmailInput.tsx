// @ts-ignore
import React, { useContext, useEffect, useRef, useState } from "react";
import { SteedosContext, ObjectContext } from "@steedos/builder-steedos";

import { SendOutlined } from "@ant-design/icons";
import { Modal, TreeSelect, Select, Input, Button } from "antd";
// import { ObjectTree } from "./ObjectTree";//"../../../builder-object";
import { ObjectTree,ObjectTablePicker } from "@steedos/builder-object"
import _ from "lodash";
import { useQuery } from "react-query";
const { Option } = Select;
interface IDepartment {
  name: string;
  users: any[];
  parent?: IDepartment;
  children?: IDepartment[];
}

function getFilter(ids, key) {
  return ids.map((id) => (key || "_id") + " eq '" + id + "'").join(" or ");
}
const { SHOW_PARENT, SHOW_CHILD } = TreeSelect;
const DepartmentChosePanel = ({ openPopup, onClose, onChange }) => {
  const objectContext = useContext(ObjectContext);

  const [treeData, setTreeData] = useState([]);
  const [allUserIds, setAllUserIds] = useState([]);
  // const [treeDataPool, setTreeDataPool] = useState({});

  const treeDataPoolRef = useRef({});

  // useEffect(() => {
  //   // const { isLoading, error, data, isFetching }: any = useQuery(
  //   //   objectApiName,
  //   //   async () => {
  //   //     return await objectContext.requestRecords(objectApiName, [], fields);
  //   //   }
  //   // );
  //   (async () => {
  //     const data = await objectContext.requestRecords(
  //       "organizations",
  //       [],
  //       ["name", "users", "children", "parent"]
  //     );

  //     if (data) {
  //       let td: any = [];
  //       let au: any = [];
  //       let tp = treeDataPoolRef.current;
  //       data.forEach(({ _id, parent, name, users, children }) => {
  //         tp[_id] = tp[_id] || {
  //           value: _id,
  //           key: _id,
  //           title: name,
  //           users,
  //           children: [],
  //         };
  //         tp[parent] ? tp[parent].children.push(tp[_id]) : (td = [tp[_id]]);
  //         au = [...au, ...users];
  //       });
  //       setTreeData(td);
  //       setAllUserIds(Array.from(new Set(au)));
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (allUserIds.length > 0) {
  //     //   const {
  //     //     isLoading: userIsLoading,
  //     //     error: userError,
  //     //     data: userData,
  //     //     isFetching: userIsFetching,
  //     //   }: any = useQuery(objectApiName, async () => {
  //     //     return await objectContext.requestRecords(
  //     //       "space_users",
  //     //       [["_id", "in", allUserIds]],
  //     //       ["name", "email"]
  //     //     );
  //     //   });
  //     // (async () => {
  //     //   const userData = await objectContext.requestRecords(
  //     //     "space_users",
  //     //     // [],
  //     //     getFilter(allUserIds, "user"),
  //     //     // `user in (${allUserIds.join(",")})`,
  //     //     ["name", "user", "email"]
  //     //   );

  //     //   if (allUserIds.length > 0 && userData) {
  //     //     Object.values(treeDataPoolRef.current).forEach((dp: any) => {
  //     //       dp.users = dp.users.map((uid: string) => {
  //     //         let u = userData.find(({ user }) => {
  //     //           return user == uid;
  //     //         });
  //     //         return {
  //     //           value: u.user,
  //     //           key: u.user,
  //     //           title: u.name + "<" + u.email + ">",
  //     //           email: u.email,
  //     //         };
  //     //       });
  //     //       dp.children = [...dp.children, ...dp.users];
  //     //       console.log(dp.users);
  //     //     });

  //     //     setTreeData([...treeData]);
  //     //   }
  //     // })();
  //   }
  // }, [allUserIds]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  
  const handleOnChange = (users) => {
    setSelectedEmails(users.map(({name,email})=>`${name}<${email}>`))
  }
  return (
    <Modal
        width="100%"
      visible={openPopup}
      onCancel={() => onClose()}
      onOk={() => {
        onChange(selectedEmails)
        onClose()
      }}
    >

      <ObjectTablePicker
        includeSub={true}
        onChange={handleOnChange}
        treeProps={{
          objectApiName: "organizations",
          style: { width: "100%" },
          defaultExpandAll: true,
          onChange: (values) => {
            console.log(values)
          },
        }}
        tableProps={{
        objectApiName:"space_users",
        columnFields:[{
          fieldName: "name"
        }, {
          fieldName: "email"
        }]
        }}
      ></ObjectTablePicker>
      {/* <ObjectTree
        objectApiName="organizations"
        style={{ width: "100%" }}
        defaultExpandAll={true}
        onChange={(values) => {
          console.log(values)
          //setSelectedEmails(texts)
        }}
      /> */}
    </Modal>
  )
};

export const EmailInput = () => {
  const [selectedEmails, setSelectedEmails] = useState<any[]>([]);
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <>
      <Input.Group compact style={{ display: "flex" }}>
        <Button
          style={{
            display: "flex",
            alignItems: "center",
          }}
          icon={<SendOutlined />}
          onClick={() => setOpenPopup(true)}
        >
          发送到
        </Button>
        <Select mode="tags" style={{ flex: 1 }} value={selectedEmails}>
          {selectedEmails.map((item, i) => (
            <Option key={i} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </Input.Group>

      <DepartmentChosePanel
        openPopup={openPopup}
        onClose={() => setOpenPopup(false)}
        onChange={(emails) => {
          setSelectedEmails(_.uniq([...selectedEmails, ...emails]));
        }}
      ></DepartmentChosePanel>
    </>
  );
};
