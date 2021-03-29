import React from "react";
import type { ProFieldFCMode } from '@ant-design/pro-utils';
import { Button, Select, Spin } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { ObjectContext } from "../";
import { useQuery } from "react-query";
import _ from 'lodash';

export type ObjectFieldLookupProps = {
    name: string,
    referenceTo: string,
};
export function ObjectFieldLookup(props: ObjectFieldLookupProps) {

    const objectContext = React.useContext(ObjectContext);
    const [value, setValue] = React.useState([]);
    const {
        name,
        referenceTo,
        ...rest
    } = props
    // console.log("Objloopup=============",props);

    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [searchKey, setSearchKey] = React.useState("");


    const {
        isLoading,
        error,
        data,
        isFetching
    } = useQuery(searchKey, async () => {
        const filters = [['name']];
        const fields = ['_id', 'name'];
        return await objectContext.requestRecords(referenceTo, filters, fields);
    });
    // console.log("objectContext.requestRecords---", data);
    // const objectData: any = data
    if (!data)
        return (<div>Loading...</div>)


    let newOptions: any = []
    if (!options || options.length == 0) {
        console.log(1);

        _.forEach(data.value, (item: any) => {
            // console.log("data=======================", data.value);
            newOptions.push({
                label: item.name,
                value: item._id
            })
        })

        console.log(newOptions);
        setOptions(newOptions);
    }
    // const handleSearch = (value: any) => {
    //     console.log(1111);
    //     setOptions([])
    //     console.log("setOptions([])========",options);
    //     console.log(value);
    //     setSearchKey(value)
    //     console.log("setSearchKey(value)=========", searchKey);
    //     // if (value) {
    //     //     setOptions([])
    //     //     setSearchKey(value);
    //     // }else{

    //     // }
    // };


    return (


        <Select
            showSearch={true}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            showArrow={true}
            filterOption={true}
            defaultActiveFirstOption={true}
            value={value}
            // onSearch={handleSearch}
            onChange={(newValue) => {
                setValue(newValue);
            }}
            style={{
                width: '100%',
            }}
            defaultOpen={true}
            options={options}
            {...rest}
        >
        </Select>
    )
}