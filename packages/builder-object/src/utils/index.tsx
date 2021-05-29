import _ from 'lodash';
import { Apps } from '@steedos/builder-store';
export function getObjectRecordUrl(objectApiName: string, redordId: any) {
  const hrefPrefix = `/app/${Apps.currentAppId || "-"}/${objectApiName}/view/`;
  return `${hrefPrefix}${redordId}`;
}


/**
把后端请求到的records记录转换成以下treeData的格式
[
    {
        title: 'Node1',
        value: '0-0',
        children: [
            {
                title: 'Child Node1',
                value: '0-0-1',
            },
            {
                title: 'Child Node2',
                value: '0-0-2',
            },
        ],
    },
    {
        title: 'Node2',
        value: '0-1',
    },
];
*/
export const getTreeDataFromRecords = (records: [] = [], nameField: string = "name", parentField: string = "parent")=>{
  let result = [], tempParentValue: string, rootNode: any;
  let getChildrenNodes = (parent: string)=>{
    let nodes = [];
    records.forEach((record: any)=>{
      if(record.parent === parent){
        let tempNode: any = {
          title: record[nameField],
          value: record._id,
          key: record._id
        };
        const tempChildren = getChildrenNodes(record._id);
        if(tempChildren && tempChildren.length){
          tempNode.children = tempChildren;
        }
        nodes.push(tempNode);
      }
    });
    return nodes;
  }
  let getTreeNode = (record: any)=>{
    tempParentValue = record[parentField];
    let isRoot = !tempParentValue;
    if(!isRoot){
      const isParentExist = !!records.find((item: any)=>{
        return item._id === tempParentValue;
      });
      isRoot = !isParentExist;
    }
    if(isRoot){
      let tempNode: any = {
        title: record[nameField],
        value: record._id,
        key: record._id
      };
      const tempChildren = getChildrenNodes(record._id);
      if(tempChildren && tempChildren.length){
        tempNode.children = tempChildren;
      }
      return tempNode;
    }
  }
  records.forEach((record)=>{
    rootNode = getTreeNode(record);
    if(rootNode){
      result.push(rootNode);
    }
  });
  return result;
}