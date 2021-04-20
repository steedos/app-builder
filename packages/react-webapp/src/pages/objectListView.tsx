import React, { useRef, useState } from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { ObjectTable } from '@steedos/builder-object';

export default function ObjectListView(props: any) {
    const { objectApiName } = props;
    return (
      <PageContainer content={false} title={false} header={undefined}>
        <ObjectTable objectApiName={objectApiName} columnFields={[{ fieldName: "name" }]} />
    </PageContainer>
    );
  };