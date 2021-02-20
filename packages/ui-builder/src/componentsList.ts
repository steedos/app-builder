export type MenuItem = {
  children?: MenuItems
  soon?: boolean
  rootParentType?: ComponentType
  defaultProps?: any
}

type MenuItems = Partial<
  {
    [k in ComponentType]: MenuItem
  }
>

export const menuItems: MenuItems = {
  FormSection: {
  },
  Accordion: {
    children: {
      Accordion: {},
      AccordionItem: {},
      AccordionButton: {},
      AccordionPanel: {},
      AccordionIcon: {},
    },
  },
  Alert: {
    children: {
      Alert: {},
      AlertDescription: {},
      AlertIcon: {},
      AlertTitle: {},
    },
  },
  AspectRatio: {},
  AvatarGroup: {
    rootParentType: 'Avatar',
  },
  Avatar: {},
  AvatarBadge: {
    rootParentType: 'Avatar',
  },
  Badge: {},
  Box: {},
  Breadcrumb: {
    children: {
      BreadcrumbItem: {},
      BreadcrumbLink: {},
    },
  },
  Button: {},
  Center: {},
  Container: {},
  Checkbox: {},
  CircularProgress: {},
  CloseButton: {},
  Code: {},
  Divider: {},
  Flex: {},
  FormControl: {
    children: {
      FormControl: {},
      FormLabel: {},
      FormHelperText: {},
      FormErrorMessage: {},
    },
  },
  Grid: {},
  Heading: {},
  Icon: {},
  IconButton: {},
  Image: {},
  Input: {},
  InputGroup: {
    rootParentType: 'Input',
    children: {
      InputGroup: {},
      Input: {},
      InputLeftAddon: {},
      InputRightAddon: {},
      InputRightElement: {},
      InputLeftElement: {},
    },
  },
  Link: {},
  List: {
    children: {
      List: {},
      ListItem: {},
    },
  },
  NumberInput: {},
  Progress: {},
  Radio: {},
  RadioGroup: {
    rootParentType: 'Radio',
  },
  SimpleGrid: {},
  Spinner: {},
  Select: {},
  Stack: {},
  Switch: {},
  Tag: {},
  Text: {
    defaultProps: {
      children:"UnTitled Text"
    }
  },
  Textarea: {},
  Menu: { soon: true },
  Tab: { soon: true },
  /*"Tabs",
  "TabList",
  "TabPanel",
  "TabPanels"*/
}

export const componentsList: ComponentType[] = [
  'FormSection',
  // 以下是Chakra包组件
  'Accordion',
  'AccordionIcon',
  'AccordionItem',
  'AccordionPanel',
  'Alert',
  'AlertDescription',
  'AlertIcon',
  'AlertTitle',
  'AspectRatio',
  'Avatar',
  'AvatarBadge',
  'AvatarGroup',
  'Badge',
  'Box',
  'Breadcrumb',
  'BreadcrumbItem',
  'BreadcrumbLink',
  'Button',
  'Center',
  'Checkbox',
  'CircularProgress',
  'CloseButton',
  'Code',
  'Container',
  'Divider',
  'Editable',
  'Flex',
  'FormControl',
  'FormErrorMessage',
  'FormHelperText',
  'FormLabel',
  'Grid',
  'Heading',
  'Icon',
  'IconButton',
  'Image',
  'Input',
  'InputGroup',
  'InputLeftAddon',
  'InputLeftElement',
  'InputRightAddon',
  'InputRightElement',
  'Link',
  'List',
  'ListIcon',
  'ListItem',
  'Menu',
  'NumberInput',
  'Progress',
  'Radio',
  'RadioGroup',
  'Select',
  'SimpleGrid',
  'Spinner',
  'Stack',
  'Switch',
  'Tab',
  'TabList',
  'TabPanel',
  'TabPanels',
  'Tabs',
  'Tag',
  'Text',
  'Textarea',
]

export const menuFieldsParms = {
  "fields":{
    "label": "字段",
    "expanded": true,
    "components": {
      "form-item-name":{
        "type": "form-item",
        "label": "合同名称",
        "defaultProps": {
          "objectName": "contracts",
          "fieldName": "name",
          "fieldType": "text",
        }
      },
      "form-item-amount":{
        "type": "form-item",
        "label": "合同金额",
        "defaultProps": {
          "objectName": "contracts",
          "fieldName": "amount",
          "fieldType": "currency",
        }
      }
    }
  },
}