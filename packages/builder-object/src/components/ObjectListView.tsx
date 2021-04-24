import React, { useContext, useRef, useEffect, useState } from "react"
import _ from "lodash"
import { ObjectForm, ObjectTable } from "./"
import ProTable, {
  ProTableProps,
  RequestData,
  ProColumnType,
  ActionType,
} from "@ant-design/pro-table"
import { observer } from "mobx-react-lite"
import { Objects, API, Settings } from "@steedos/builder-store"
import { Button, Dropdown, Menu, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Link } from "react-router-dom";
import { getObjectRecordUrl } from "../utils"

export type ObjectListViewColumnProps = {
  fieldName: string
} & ProColumnType

export type ObjectListViewProps<T extends ObjectListViewColumnProps> =
  | ({
      name?: string
      appApiName?: string
      objectApiName?: string
      listName?: string
      columnFields?: T[],
      history?:any,
      filters?: [] | string
      onChange?: ([any]) => void
      // filterableFields?: [string]
    } & {
      defaultClassName?: string
    })
  | any

export const getObjectListViewProColumn = (field: any) => {
  // 把yml中的某个字段field转成ant的ProTable中的columns属性项
  if (!field) {
    return null
  }

  const fieldType: string = field.type
  let proColumnProps: any = {
    title: field.label,
    dataIndex: field.name,
    formItemProps: {},
    fieldProps: {
      field_schema: field
    },
  }
  if (field.required) {
    proColumnProps.formItemProps.required = true
  }

  if (field.sortable) {
    proColumnProps.sorter = {
        multiple: 1
    };
  }

  proColumnProps.valueType = fieldType
  
  return proColumnProps
}

function getListViewFilters(listView, props){
  let { filters, filter_scope, master } = props;
  if(!filters){
    filters = listView.filters;
  }

  // filters为function的情况先不处理（因为filters中可能调用Creator，Steedos等全局变量），按空值返回
  // filters = _.isFunction(filters) ? filters() : filters;
  filters = _.isFunction(filters) ? [] : filters;
  if(!filter_scope){
    filter_scope = listView.filter_scope;
  }
  if(filter_scope === "mine"){
    const filtersOwner=[["owner", "=", Settings.userId]];
    if(filters && filters.length){
      filters = [filtersOwner, filters];
    }
    else{
      filters = filtersOwner;
    }
  }

  if(master){
    filters = [[master.relatedFieldApiName, "=", master.recordId], filters];
  }

  return filters;
}

function getListviewColumns(objectSchema: any, listName: any){
  let listView = objectSchema.list_views[listName];
  let listViewColumns = listView && listView.columns;
  if(!listViewColumns){
    listView = objectSchema.list_views.default;
    listViewColumns = listView && listView.columns;
    if(!listViewColumns){
      listViewColumns = [objectSchema.NAME_FIELD_KEY]
    }
  }
  return listViewColumns;
}

function getListViewColumnFields(listViewColumns: any, props: any, nameFieldKey: string){
  let { columnFields = [] } = props;
  if (columnFields.length === 0) {
    _.forEach(listViewColumns, (column: any) => {
      const fieldName: string = _.isObject(column) ? (column as any).field : column;
      let columnOption: any = { fieldName };
      if(fieldName === nameFieldKey){
        columnOption.render = (dom: any, record: any)=>{
          return (<Link to={getObjectRecordUrl(props.objectApiName, record._id)} className="text-blue-600 hover:text-blue-500 hover:underline">{dom}</Link>);
        }
      }
      columnFields.push(columnOption)
    })
  }
  return columnFields;
}

function getButtons(schema, props, options){
  let { objectApiName, appApiName = "-", master} = props
  const title = schema.label;
  function afterInsert(result) {
    if(master && options && options.actionRef){
      options.actionRef.current.reload();
      return true;
    }
    if(result && result.length >0){
      const record = result[0];
      message.success('新建成功');
      if(options.history){
        options.history.push(`/app/${appApiName}/${objectApiName}/view/${record._id}`);
      }
      return true;
    }
  }

  let initialValues = null;
  if(master){
    initialValues = {
      [master.relatedFieldApiName]: master.recordId
    }
  }

  const extraButtons: any[] = [];
  const dropdownMenus: any[] = [];

  extraButtons.push(<ObjectForm initialValues={initialValues} key="standard_new" afterInsert={afterInsert} title={`新建 ${title}`} mode="edit" isModalForm={true} objectApiName={objectApiName} name={`form-new-${objectApiName}`} submitter={false} trigger={<Button type="primary" >新建</Button>}/>)
  _.each(schema.actions, function (action: any, actionApiName: string) {
      let visible = false;

      if (_.isString(action._visible)) {
          try {
              const visibleFunction = eval(`(${action._visible})`);
              visible = visibleFunction(objectApiName)
          } catch (error) {
              // console.error(error, action._visible)
          }
      }

      if (_.isBoolean(action._visible)) {
          visible = action._visible
      }

      if (visible && _.includes(['list'], action.on)) {
          if (extraButtons.length < 5) {
              extraButtons.push(<Button key={actionApiName} onClick={action.todo}>{action.label}</Button>)
          } else {
              dropdownMenus.push(<Menu.Item key={actionApiName} onClick={action.todo}>{action.label}</Menu.Item>)
          }
      }
  });
  return {
    extraButtons,
    dropdownMenus
  }
}

export const ObjectListView = observer((props: ObjectListViewProps<any>) => {
  let {
    objectApiName,
    listName = "all",
    ...rest
  } = props
  const ref = useRef<ActionType>();
  const object = Objects.getObject(objectApiName);
  if (object.isLoading) return (<div>Loading object ...</div>)
  const schema = object.schema; 
  const title = schema.label;
  let listView = schema.list_views[listName];
  const listViewColumns = getListviewColumns(schema, listName);
  const columnFields = getListViewColumnFields(listViewColumns, props, schema.NAME_FIELD_KEY);
  const filters = getListViewFilters(listView, props);
  const {extraButtons, dropdownMenus} = getButtons(schema, props, {actionRef: ref, history: rest.history});
  const extra = [...extraButtons];
  if(dropdownMenus.length > 0){
    extra.push(<Dropdown
      key="dropdown"
      trigger={['click']}
      overlay={
        <Menu>
          {dropdownMenus}
        </Menu>
      }
    >
      <Button key="4" style={{ padding: '0 8px' }}>
        <EllipsisOutlined />
      </Button>
    </Dropdown>)
  }
  return (
    <PageContainer content={false} title={false} header={{
      title: title,
      ghost: true,
      extra: extra,
    }}>
    <ObjectTable
      actionRef={ref} 
      objectApiName={objectApiName}
      columnFields={columnFields}
      filters={filters}
      className={["object-listview", rest.className].join(" ")}
      {...rest}
    />
    </PageContainer>
  )
})