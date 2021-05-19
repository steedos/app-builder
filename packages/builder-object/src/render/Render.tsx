import React from "react";
import { observer } from "mobx-react-lite"
import RenderForm, { useForm as RenderFormUseForm } from '../render/RenderForm';

export const Render = (props: any) => {
  const {
    initialValues = {},
    debounceInput = false,
    schema
  } = props;
  console.log('run Render.......');
  const useForm: any = RenderFormUseForm({formData: initialValues});
  return (
    <RenderForm debug={false} form={useForm} schema={schema} debounceInput={debounceInput}></RenderForm>
  )
};