
import React, { useContext } from 'react';

import ProField, {defaultRenderText} from '@ant-design/pro-field';
import ConfigContext, { useIntl } from '@ant-design/pro-provider';
import { pickProProps, omitUndefined } from '@ant-design/pro-utils';

import FieldPercent from '@ant-design//pro-field/lib/components//Percent';
import FieldIndexColumn from '@ant-design//pro-field/lib/components//IndexColumn';
import FieldProgress from '@ant-design//pro-field/lib/components//Progress';
import FieldMoney from '@ant-design//pro-field/lib/components//Money';
import FieldDatePicker from '@ant-design//pro-field/lib/components//DatePicker';
import FieldFromNow from '@ant-design//pro-field/lib/components//FromNow';
import FieldRangePicker from '@ant-design//pro-field/lib/components//RangePicker';
import FieldCode from '@ant-design//pro-field/lib/components//Code';
import FieldTimePicker, { FieldTimeRangePicker } from '@ant-design//pro-field/lib/components//TimePicker';
import FieldText from '@ant-design//pro-field/lib/components//Text';
import FieldTextArea from '@ant-design//pro-field/lib/components//TextArea';
import FieldPassword from '@ant-design//pro-field/lib/components//Password';
import FieldStatus from '@ant-design//pro-field/lib/components//Status';
import FieldOptions from '@ant-design//pro-field/lib/components//Options';
import FieldSelect, {
  proFieldParsingText,
  proFieldParsingValueEnumToArray,
} from '@ant-design//pro-field/lib/components//Select';
import FieldCheckbox from '@ant-design//pro-field/lib/components//Checkbox';
import FieldRate from '@ant-design//pro-field/lib/components//Rate';
import FieldSwitch from '@ant-design//pro-field/lib/components//Switch';
import FieldDigit from '@ant-design//pro-field/lib/components//Digit';
import FieldSecond from '@ant-design//pro-field/lib/components//Second';

import FieldRadio from '@ant-design//pro-field/lib/components//Radio';
import FieldImage from '@ant-design//pro-field/lib/components//Image';

import {FieldLookup} from './FieldLookup';


const steedosRenderText = (
  text: ProFieldTextType,
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps,
  valueTypeMap: Record<string, ProRenderFieldPropsType>,
): React.ReactNode => {

  if (valueType === 'lookup') {
    return <FieldLookup text={text} valueType={valueType} {...props}/>
  }

  if (valueType === 'checkbox') {
    return <ProField text={text as boolean} valueType='switch' {...props}/>
  }

  if (valueType === 'datetime') {
    return <FieldDatePicker text={text as string} format="YYYY-MM-DD HH:mm:ss" showTime {...props} />
  }

  return defaultRenderText(text, valueType, props, valueTypeMap)
}

const Field: React.ForwardRefRenderFunction<any, ProFieldPropsType> = (
  { text, valueType = 'text', onChange, value, ...rest },
  ref,
) => {
  const intl = useIntl();
  const context = useContext(ConfigContext);

  const fieldProps = pickProProps((value || onChange || rest?.fieldProps) && {
    value,
    // fieldProps 优先级更高，在类似 LightFilter 场景下需要覆盖默认的 value 和 onChange
    ...omitUndefined(rest?.fieldProps),
    onChange: (...restParams: any[]) => {
      onChange?.(...restParams);
      rest?.fieldProps?.onChange?.(...restParams);
    },
    allowClear: false,
  });
  
  return steedosRenderText(
    text ?? fieldProps?.value ?? '',
    valueType || 'text',
    {
      ...rest,
      mode: rest.mode || 'read',
      ref,
      placeholder: intl.getMessage('tableForm.inputPlaceholder', '请输入'),
      fieldProps: pickProProps(fieldProps),
    },
    context.valueTypeMap,
  )
}


export default React.forwardRef(Field) as typeof ProField;
