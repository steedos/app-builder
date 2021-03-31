import React from 'react';
import { ObjectFieldLookup } from '../components/ObjectFieldLookup'

// type LookupProps = {
//     name: string,
//     objectApiName?: string,
//     fieldName: string
// };

// const Lookup = (props: LookupProps) {
//         console.log(props);
        
//     return (
//         <ObjectFieldLookup  {...props} />
//     )
// }

export const lookup = {
    render: (text: any, props: any) => {
        const link = "lookupto:" + text;
        return (<a href={link}>{text}</a>)
    },
    renderFormItem: (_: any, props: any) => {
        // console.log("props====lookup", props);
        return (
            <ObjectFieldLookup  referenceTo={props.fieldProps.reference_to} {...props} />
            // <a href="www.baidu.com">2342423</a>
        )
    }
}