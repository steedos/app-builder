import React from 'react';
import { translateMessage } from '../../utils/utils';

const ErrorMessage = ({ message, schema, hideValidation }) => {
  let msg = '';
  if (typeof message === 'string') msg = message;
  if (Array.isArray(message)) {
    msg = message[0] || '';
  }

  msg = translateMessage(msg, schema);

  return !msg && hideValidation ? null : (
    <div className={`ant-form-item-explain ant-form-item-explain-error`}>{msg}</div>
  );
};

export default ErrorMessage;
