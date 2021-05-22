export const getWidgets = () => {
  return [
    {
      text: '文本',
      name: 'text',
      widget: 'text',
      schema: {
        title: '文本',
        type: 'string',
        widget: 'text',
      },
      setting: {
        label: {
          title: '显示名',
          type: 'string',
        },
      },
    },
    {
      text: '日期',
      name: 'date',
      widget: 'date',
      schema: {
        title: '日期',
        label: '日期',
        type: 'date',
        widget: 'date',
      },
      setting: {
      },
    },
  ]
}

export const getSettings = () => {

  return [
    {
      title: '基础组件',
      widgets: getWidgets(),
      show: true,
      useCommon: false, 
    },
  ]
}

export const getCommonSettings = () => {
  return {
    $id: {
      title: 'API名称',
      description: '数据存储的名称/英文/必填',
      type: 'string',
      widget: 'idInput',
    },
    title: {
      title: '显示名',
      type: 'string',
    },
    required: {
      title: '必填',
      type: 'boolean',
    },
    // placeholder: {
    //   title: '占位符',
    //   type: 'string',
    // },
    // disabled: {
    //   title: '禁用',
    //   type: 'boolean',
    // },
    readOnly: {
      title: '只读',
      type: 'boolean',
    },
    // hidden: {
    //   title: '隐藏',
    //   type: 'boolean',
    // },
    default: {
      title: '默认值',
      type: 'string',
    },
    description: {
      title: '备注',
      type: 'string',
    },
  }
}