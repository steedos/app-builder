export const getFields = (objectApiName) => {
  return [
    {
      text: '名称',
      name: 'name',
      widget: 'ObjectField',
      schema: {
        title: '名称',
        type: 'string',
      },
      setting: {
        fieldName: {
          title: '字段名',
          type: 'string',
        },
      },
    },
    {
      text: '所有者',
      name: 'owner',
      widget: 'ObjectField',
      schema: {
        title: '所有者',
        type: 'string',
      },
      setting: {
        minLength: {
          title: '最短字数',
          type: 'number',
        },
      },
    }
  ]
}

export const getRelatedLists = (objectApiName) => {
  return [{

  }]
}

export const getSettings = (objectApiName) => {

  return [
    {
      title: '字段',
      widgets: getFields(objectApiName),
      show: true,
      useCommon: false, 
    },
    // {
    //   title: '相关子表',
    //   widgets: getRelatedLists(objectApiName),
    //   show: true,
    //   useCommon: false,
    // }
  ]
}

export const getCommonSettings = () => {
  return {
    $id: {
      title: 'ID',
      description: '数据存储的名称/英文/必填',
      type: 'string',
      widget: 'idInput',
    },
  }
}