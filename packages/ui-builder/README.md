# Steedos App Builder

Drag and drop app building using your react components

## 包架构

### ui-components

实现包括普通控件、lookup控件、grid列表控件在内的所有UI控件功能。

#### 依赖包

- @chakra-ui，包括`@chakra-ui/icons`、`@chakra-ui/react`、`@chakra-ui/theme`在内的相关包。
- amis。

#### 输出

- 封装@chakra-ui中基本控件输出。
- 封装amis中的Picker控件输出为lookup控件。
- 包老师在处理的Grid列表控件
- FormItem组件，即字段组件，能根据字段类型自动输出上述提到的基础组件，并且支持字段必填、只读等属性。
- FormSection组件，即字段分组组件，其内只能接受FormItem组件为子组件，继承`@chakra-ui/react`中的`Accordion`组件，封装简化其功能输出新组件。
- RelatedList组件，即相关表组件，显示相关列表，需要指定相关表名称及要显示哪些字段。

### ui-render

实现包括普通控件、lookup控件、grid列表控件在内的所有UI控件的渲染。

#### 依赖包

- ui-components

#### 传入

- `ui-builder`包中输出的json，传入的json有每个字段是否只读必填等属性。
- 上述json中type与组件名称对应关系，即json中每个type分别应该用什么组件来渲染，不能为空。

`**antd-render.page.jsx`**

```jsx
import {Form, Input} from '@antd';
import UIRender  from '@steedos/ui-render';

// 这个就是ui-builder包中输出的json
pageJSON = {
  ...
}

components = {
  "@antd/Form": Form,
  "@antd/Input": Input
}

<UIRender page={pageJSON} components={components}/>
```

#### 输出

最终用户看到的界面效果。

### ui-builder

基于`open-chakra`这个包的源码改造，实现ui的设计功能。

#### 依赖包

- ui-components

#### 传入

- 支持拖动哪些组件类型，即左侧组件列表显示哪些可拖动的菜单。
- 其他设计器开关属性，比如是否显示顶部header。

传入的参数是一个组件数组，其元素格式如下：

```text
{
  "label": "{group-label}",
  "expanded": true/false,
  "components":[
    "type": "{component-type}",
    "component": {组件定义},
    "componentSettings": {对应的右侧属性设置组件定义},
    "droppable": ["{component-type}",...], // 只有指定控件才能拖入
    "droppable": true, //所有控件都能拖入
    "label": "{component-label}",
    "defaultProps": {
      ...
    }
  ]
}
```

注意：传入的json第一层要求是group，它本身不可以被拖动，其下子节点`components`中的内容才是可以拖动的组件。

比如以下代码允许拖动Form和Input组件到中间面板，且Form中只能接收拖动Input组件到里面：

**`antd-build.page.jsx`**

```jsx
import {Form, Input} from '@antd';
import UIBuilder  from '@steedos/ui-builder';
import FormSettings  from './components/FormSettings';
import InputSettings  from './components/InputSettings';

builderComponents =
  [{
    "label": "组件分组标题",
    "expanded": true,
    "components": [{
      "type": "@antd/Form",
      "component": Form,
      "componentSettings": FormSettings,
      "droppable": ["@antd/Input"],
      "label": "表单组件",
      "defaultProps": {
        ...
      }
    },{
      "type": "@antd/Input",
      "component": Input,
      "comoonentSettings": InputSettings,
      "label": "Input组件",
      "defaultProps": {
        ...
      }
    }]
  }]


<UIBuilder components={builderComponents}/>
```

#### 输出

- 界面设计的json
- react源码

#### 界面功能

##### 左侧菜单

左侧显示可拖动到中间面板的组件列表。

FormItem组件只能拖到FormSection组件内。

##### 中间面板

- 可以从左侧菜单中拖动字段或相关对象到面板中。
- 面板中根据每个被拖进去的字段类型显示为对应的组件样式。
- 可点击选中面板中的字段或相关对象，右侧属性栏会显示选中字段或相关对象的属性。

##### 右侧属性

- 当选中中间面板空白处时保持现状，即显示该面板本身的属性，比如Children、Backgrounds。
- 当选中中间面板中的字段或相关对象时，显示对应的属性并允许更改这些属性。

### ui-record-page-builder

基于`ui-builder`这个包的功能，实现记录详细界面的设计功能。

比如要允许拖动不同的字段组件，可以像下面这样传入组件参数给UIBuilder组件：

```jsx
import {FormSection, FormItem} from '@steedos/ui-components';
import UIBuilder  from '@steedos/ui-builder';
import FormSectionSettings  from './components/FormSectionSettings';
import FormItemSettings  from './components/FormItemSettings';

builderOptions = {
  logo: '',
  components: {
    "@steedos/ui-components/form-section": {
        "component": FormSection,
        "componentPreview": FormSectionPreview,
        // "componentSettings": FormSectionSettings,
        "componentProps": [{
          name: 
          valueType:
          ...
        }]
        "droppable": ["@steedos/ui-components/form-item"],
    }
  },
  customValueTypes: {

  }
  componentTree: [{
    "label": "字段",
    "expanded": true,
    "children": [{
        "type": "@steedos/ui-components/form-section",
        "label": "字段分组",
        "props": {
          ...
        }
      },{
        "type": "@steedos/ui-components/form-item",
        "label": "合同名称",
        "props": {
          "objectName": "contracts",
          "fieldName": "name",
          "fieldType": "text",
          ...
        }
      },{
        "type": "@steedos/ui-components/form-item",
        "label": "合同金额",
        "props": {
          "objectName": "contracts",
          "fieldName": "amount",
          "fieldType": "currency",
          ...
        }
      }
    ]
  }]


<UIBuilder {...builderOptions}/>
```

再比如要允许拖动不同的相关表的RelatedList组件，可以像下面这样传入组件参数给UIBuilder组件：

```jsx
import {RelatedList} from '@steedos/ui-components';
import UIBuilder  from '@steedos/ui-builder';
import RelatedListSettings  from './components/RelatedListSettings';

builderComponents =
  [{
    "label": "相关表",
    "expanded": true,
    "components": [{
        "type": "@steedos/ui-components/related-list",
        "component": RelatedList,
        "componentSettings": RelatedListSettings,
        "label": "付款",
        "defaultProps": {
          "objectName": "contract_payments",
          "fieldName": "contract",
          "fieldType": "master_detail",
          "columns": ["name", "amount"]
        }
      },{
        "type": "@steedos/ui-components/related-list",
        "component": RelatedList,
        "componentSettings": RelatedListSettings,
        "label": "收款",
        "defaultProps": {
          "objectName": "contract_receipts",
          "fieldName": "contract",
          "fieldType": "master_detail",
          "columns": ["name", "amount"],
        }
      }
    ]
  }]


<UIBuilder components={builderComponents}/>
```


#### 依赖包

- ui-builder

#### 传入

- ObjectName
- RecordId
- UserId

根据ObjectName得到有哪些字段，然后把所有字段都生成对应的`FormItem`组件的json，传入到`ui-builder`包中。
根据ObjectName得到有哪些相关表，然后把所有相关表都生成对应的`RelatedList`组件的json，传入到`ui-builder`包中。

> 注意：相关表虽然传入的json需要指定columns属性，但是该属性是自动赋值进去的，不需要也不允许用户变更（以后对象会考虑增加作为相关表时显示哪些字段的配置，只能从那里设置相关表显示哪些字段）。

#### 输出

- 界面设计的json
- react源码

#### 界面功能

##### 左侧菜单

左侧显示一个二级菜单：

- 字段
  - 字段分组（FormSection）
  - 字段1（FormItem）
  - 字段2
  - ...
- 相关表
  - 相关表1（RelatedList）
  - 相关表2
  - ...
- 组件（其他组件）
  - button
  - container
  - flex
  - center
  ...

上述字段列表及相关表是根据传入的objectName来显示当前对象下的所有字段label及相关表关联对象的label。

菜单中第一层是菜单分组，不可以拖动，一共三组。

每个字段都预设了对应的默认属性到FormItem组件，相关表也是一样的原理，即预设了对应的默认属性到RelatedList组件。

##### 中间面板

同`ui-builder`。

##### 右侧属性

同`ui-builder`。

### ui-page-builder

基于`ui-builder`这个包的功能，实现普通界面的设计功能，比如Dashboard界面设计。

#### 依赖包

- ui-builder

#### 传入

待定。

#### 输出

- 界面设计的json
- react源码

### ui-form-builder

基于`ui-builder`这个包的功能，实现流程设计中的表单设计功能。

#### 依赖包

- ui-builder

#### 传入

待定。

#### 输出

- 界面设计的json
- react源码

