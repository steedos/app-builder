import React from 'react';

/**
 * 对象字段类型组件
 * 定义对象的key,value键值对结构，可在界面编辑该对象结构的数据并保存到数据库中
 * 组件支持属性
 * - name: string
 * - subFields: [{name: xx, type: xx, reference_to: xx, multiple: xx, ...}, ...], 字段数组,其元素是每个字段的字义
 * 比如华炎魔方cms_posts对象中有一个members字段，其yml文件定义如下：
 *   members:
      type: object
      label: Members
      is_wide: true
    members.users:
      type: lookup
      label: User Members
      reference_to: users
      multiple: true
      filterable: true
    members.organizations:
      type: lookup
      label: Organization Members
      reference_to: organizations
      multiple: true
      filterable: true
 * 保存到cms_posts表记录中对应为以下效果：
    "members" : {
        "users" : [ 
            "5fdbe2a67447ff11ed5851e5"
        ],
        "organizations" : [ 
            "WNpmGhCzhq5H2y5yZ"
        ]
    }
 * 在这里对应的组件属性为：
    subFields: [{
      name: "members.organizations",
      type: "lookup",
      reference_to: "organizations",
      multiple: true
    },{
      name: "members.users",
      type: "lookup",
      reference_to: "users",
      multiple: true
    }]
 */
export const object = {
  render: (text: any, props: any) => {
    return (<div>object display</div>)
  },
  renderFormItem: (_: any, props: any) => {
    // 通过props.objectFieldProps.subFields能取到subFields属性值
    return (<div>object field</div>)
  }
}