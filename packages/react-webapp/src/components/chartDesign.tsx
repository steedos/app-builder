import React, { useState } from "react";
import { Renderer, Editor } from "@redash/viz";
import { Select } from 'antd';
import { observer } from "mobx-react-lite";
import { Queries } from "@steedos/builder-store";
import { Row, Col, Form, Input } from 'antd';
import { Objects } from '@steedos/builder-store';

const { Option } = Select;
export const CHART_OBJECT_APINAME = 'charts';

export type ChartDesignProps = {
    chartId: string,
    onEditOptionsChange?: Function,
    form?: any
}

export const ChartDesign = observer((props: ChartDesignProps) => {
    const { chartId, form, onEditOptionsChange } = props;
    const object: any = Objects.getObject(CHART_OBJECT_APINAME);
    if (object.isLoading) return (<div>Loading object ...</div>);
    const recordCache = object.getRecord(chartId, [])
    if (recordCache.isLoading) return (<div>Loading record ...</div>)
    let record: any = null;
    if(recordCache.data && recordCache.data.value && recordCache.data.value.length > 0){
        record = recordCache.data.value[0];
    }
    if(!record){
        return (<div>Loading record ...</div>)
    }
    
    const [options, setOptions] = useState(record.options || {});
    const [type, setType] = useState(record.type);
    const onOptionsChange = function (data) {
        setOptions(data)
        if(onEditOptionsChange){
            onEditOptionsChange(data);
        }
    }

    const onChange = function (a, b, c, d) {
        console.log(`onChange`, a, b, c, d)
    }

    const handleChange = function (value) {
        setType(value);
    }
    const query: any = Queries.getData(record.query);
    if (query.isLoading) return (<div>Loading Query Results...</div>)
    const data = query.data

    const onValuesChange = function (values) {
        console.log(`onFormLayoutChange`, values)
    }

    return (
        <Row gutter={[24, 24]}>
            <Col span={9}>
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={onValuesChange}
                    initialValues={{
                        type: type,
                        label: record.label,
                    }}
                >
                    <Form.Item label="Visualization Type" name="type" rules={[{ required: true }]}>
                        <Select style={{ width: "100%" }} onChange={handleChange}>
                            <Option value="CHART">Chart</Option>
                            <Option value="COHORT">Cohort</Option>
                            <Option value="COUNTER">Counter</Option>
                            <Option value="DETAILS">Details View</Option>
                            <Option value="FUNNEL">Funnel</Option>
                            <Option value="CHOROPLETH">Map (Choropleth)</Option>
                            <Option value="Map (Markers)">MAP</Option>
                            <Option value="PIVOT">Pivot Table</Option>
                            <Option value="SANKEY">Sankey</Option>
                            <Option value="SUNBURST_SEQUENCE">Sunburst Sequence</Option>
                            <Option value="TABLE">Table</Option>
                            <Option value="WORD_CLOUD">Word Cloud</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Visualization Name" name="label" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
                <Editor
                    type={type}
                    visualizationName="Example Visualization"
                    options={options}
                    data={data}
                    onChange={onChange}
                    onOptionsChange={onOptionsChange}
                />
            </Col>
            <Col span={14}>
                <Renderer type={type} options={options} data={data} />
            </Col>
        </Row>
    );
})