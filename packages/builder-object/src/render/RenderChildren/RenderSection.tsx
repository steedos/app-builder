import React from 'react';
import Core from '../index';
import { FieldSection } from "@steedos/builder-form";
const RenderSection = ({
  children = [],
  dataIndex = [],
  displayType,
  hideTitle,
  title
}) => {
  return (
    <FieldSection title={title} titleHidden={hideTitle}>
      {children.map((child, i) => {
        const FRProps = {
          displayType,
          id: child,
          dataIndex,
          hideTitle,
        };
        return <Core key={i.toString()} {...FRProps} />;
      })}
    </FieldSection>
  );
};

export default RenderSection;
