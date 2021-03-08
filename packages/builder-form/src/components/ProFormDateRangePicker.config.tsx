export const configProFormDateRangePicker = {
  name: '@steedos/builder-form:DateRangePicker',
  inputs: [
    { name: 'name', type: 'text', defaultValue: 'dateRange', required: true },
    { name: 'label', type: 'text', defaultValue: 'DateRange Picker', required: true },
    { name: 'readonly', type: 'boolean', defaultValue: false },
    { name: 'width', type: 'string', defaultValue: 'md', enum: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { name: 'disabled', type: 'boolean', defaultValue: false, helperText: '禁用' },
    {
      name: 'fieldProps', type: 'object', subFields: [
        { name: 'allowClear', type: 'boolean', defaultValue: true, helperText: '是否显示清除按钮' },
        { name: 'autoFocus', type: 'boolean', defaultValue: false, helperText: '自动获取焦点' },
        { name: 'inputReadOnly', type: 'boolean', defaultValue: false, helperText: '设置输入框为只读（避免在移动设备上打开虚拟键盘）' }
      ]
    }
  ],
  defaultStyles: {
    display: 'block',
    marginTop: '0',
  },
  canHaveChildren: false
};
