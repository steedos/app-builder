/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from 'react';
import { updateSchemaToNewVersion, getValueByPath } from '../utils/utils';
import Core from './index';
import { Ctx, StoreCtx, Store2Ctx } from '../utils/hooks';
import { mapping as defaultMapping } from '../utils/mapping';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
const defaultBeforeFinish = props => {
  console.log('beforeFinish:', props);
};

const defaultFinish = (data, errors) => {
  console.log('onFinish:', { data, errors });
};


export { useForm } from '../utils/useForm';
export { connectForm } from '../utils/connectForm';

function App({
  widgets = {},
  mapping,
  form,
  beforeFinish = defaultBeforeFinish,
  onFinish = defaultFinish,
  displayType = 'column',
  schema,
  debug,
  debugCss,
  locale = 'cn', // 'cn'/'en'
  debounceInput = false,
  size,
  configProvider,
  theme,
  validateMessages,
  watch = {},
  config,
  onMount,
  labelWidth,
  readOnly,
  onValuesChange,
  column,
  ...rest
}) {
  try {
    const _ = form.submit;
  } catch (error) {
    console.error('form 为必填 props，<FormRender /> 没有接收到 form 属性!');
  }

  const {
    onItemChange,
    setEditing,
    touchKey,
    setValueByPath,
    getSchemaByPath,
    setSchemaByPath,
    setValues,
    getValues,
    resetFields,
    submit,
    endValidating,
    endSubmitting,
    setErrorFields,
    removeErrorField,
    removeTouched,
    syncStuff,
    ...valuesThatWillChange
  } = form;

  const {
    submitData,
    errorFields,
    isValidating,
    outsideValidating,
    isSubmitting,
    formData,
    flatten,
  } = valuesThatWillChange;

  useEffect(() => {
    // Schema最外层的type是object来判断，没有的话，认为schema没有传
    if (schema && schema.type) {
      syncStuff({
        schema,
        locale,
        validateMessages,
        beforeFinish,
        onMount,
      });
    } else {
    }
  }, [JSON.stringify(schema)]);

  // 组件destroy的时候，destroy form，因为useForm可能在上层，所以不一定会跟着destroy
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  const store = useMemo(
    () => ({
      ...valuesThatWillChange,
      ...rest,
    }),
    [
      JSON.stringify(flatten),
      JSON.stringify(formData),
      JSON.stringify(errorFields),
    ]
  );

  // 不常用的context单独放一个地方
  const store2 = useMemo(
    () => ({
      displayType,
      theme,
      column,
      debounceInput,
      debug,
      labelWidth,
      locale,
      readOnly,
    }),
    [
      displayType,
      theme,
      column,
      debounceInput,
      debug,
      labelWidth,
      locale,
      readOnly,
    ]
  );

  const tools = useMemo(
    () => ({
      mapping: { ...defaultMapping, ...mapping },
      onValuesChange,
      onItemChange,
      setEditing,
      touchKey,
      resetFields,
      setErrorFields,
      removeErrorField,
      removeTouched,
    }),
    []
  );

  useEffect(() => {
    // 需要外部校验的情况，此时 submitting 还是 false
    if (outsideValidating === true) {
      Promise.resolve(
        beforeFinish({
          data: submitData,
          schema,
          errors: errorFields,
          ...config,
        })
      ).then((error:any) => {
        if (error) {
          setErrorFields(error);
        }
        endValidating();
      });
      return;
    }
    // 如果validation结束，submitting开始
    if (isValidating === false && isSubmitting === true) {
      endSubmitting();
      onFinish(submitData, errorFields);
    }
  }, [isValidating, isSubmitting, outsideValidating]);

  // TODO: 这段代码写了没用
  let sizeCls = '';
  if (size === 'small') {
    sizeCls = 'fr-form-small';
  } else if (size === 'large') {
    sizeCls = 'fr-form-large';
  }

  const watchList = Object.keys(watch);
  // TODO: Ctx 这层暂时不用，所有都放在StoreCtx，之后性能优化在把一些常量的东西提取出来
  return (
    <ConfigProvider locale={zhCN} {...configProvider}>
      <StoreCtx.Provider value={store}>
        <Store2Ctx.Provider value={store2}>
          <Ctx.Provider value={tools}>
            <div className={`fr-container ${sizeCls}`}>
              {debug ? (
                <div className="mv2 bg-black-05 pa2 br2">
                  <div>{'formData:' + JSON.stringify(form.formData)}</div>
                  <div>{'errorFields:' + JSON.stringify(form.errorFields)}</div>
                  <div>{'touchedKeys:' + JSON.stringify(form.touchedKeys)}</div>
                  <div>{'allTouched:' + JSON.stringify(form.allTouched)}</div>
                  <div>{'isEditting:' + JSON.stringify(form.isEditing)}</div>
                  <div>
                    {'isValidating:' + JSON.stringify(form.isValidating)}
                  </div>
                  <div>
                    {'isSubmitting:' + JSON.stringify(form.isSubmitting)}
                  </div>
                </div>
              ) : null}
              {watchList.length > 0
                ? watchList.map((item, idx) => {
                    return (
                      <Watcher
                        key={idx.toString()}
                        watchKey={item}
                        watch={watch}
                        formData={formData}
                      />
                    );
                  })
                : null}
              <Core debugCss={debugCss} />
            </div>
            </Ctx.Provider>
        </Store2Ctx.Provider>
      </StoreCtx.Provider>
    </ConfigProvider>
  );
}

export { createWidget } from '../utils/createWidget';

const Wrapper = props => {
  const { isOldVersion = true, schema, ...rest } = props;
  let _schema = useRef(schema);
  if (isOldVersion) {
    _schema.current = updateSchemaToNewVersion(schema);
  }

  return <App schema={_schema.current} {...rest} />;
};

export default Wrapper;

const Watcher = ({ watchKey, watch, formData }) => {
  const value = getValueByPath(formData, watchKey);
  const watchObj = watch[watchKey];
  const firstMount = useRef(true);

  useEffect(() => {
    const runWatcher = () => {
      if (typeof watchObj === 'function') {
        watchObj(value);
      } else if (watchObj && typeof watchObj.handler === 'function') {
        watchObj.handler(value);
      }
    };

    if (firstMount.current) {
      const immediate = watchObj && watchObj.immediate;
      if (immediate) {
        runWatcher();
      }
      firstMount.current = false;
    } else {
      runWatcher();
    }
  }, [JSON.stringify(value)]);
  return null;
};
