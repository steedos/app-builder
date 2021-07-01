import { useState, useEffect } from 'react';
import { API } from '@steedos/builder-store';
import queryString from "querystring"
import { OrgChartComponent } from './OrgChart';
import * as d3 from 'd3';
import { observer } from "mobx-react-lite";
import { isNil } from "lodash"

const getRootNode = (rootId: any, data: any)=>{
    let result = data.find((item:any)=>{
        return item._id === rootId;
    });
    return result;
}


const getChildNodes = (reotIds: any, data: any)=>{
    let result = [];
    data.forEach((dataItem: any)=>{
        if (reotIds.indexOf(dataItem.parent__c) > -1) {
            result.push(dataItem);
        }
    });
    if(result.length){
        result = result.concat(getChildNodes(result.map((n)=>{return n._id;}), data));
    }
    return result;
}

export default observer((props: any) => {
    const [data, setData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('数据加载中');
    let addNodeChildFunc = null;
    const queryObject = queryString.parse(window.location.search.slice(1))
    const rootId = queryObject.rootId;
    const objectName:any = queryObject.objectName ? queryObject.objectName : 'mdm_org__c';
    const parentFieldName:any = queryObject.parentFieldName ? queryObject.parentFieldName : 'parent__c';
    function onNodeClick(nodeId) {
        // console.log('nodeId==>',nodeId)
    }

    const loadData = async(rootNodeId)=>{
        if(!rootNodeId){
            return null;
        }
        // let data = await API.requestRecords(referenceTo, filters, fields, option);
        let filters = [];
        if(objectName === 'mdm_org_legal__c'){
            filters = [['effective__c','=',true]]
        }
        let data = await API.requestRecords(objectName, filters, []);
        let results:any = [];

        const rootNode = getRootNode(rootNodeId, data.value);
        results = getChildNodes([rootNodeId], data.value);
        if(rootNode){
            results = [rootNode].concat(results);
            setErrorMessage('')
        }else{
            setErrorMessage('未找到rootId对应的记录！')
        }
        if (results.length) {
            let flag = false;
            results = results.map((item: any) => {
                if(item[parentFieldName]){
                    flag = true;
                }
                const shareholdingRatio = "<p style='margin:0'>"+item.shareholding_ratio__c+"%</p>";
                const templateContent = "<div style='display: flex;justify-content: center;align-items: center;height: 100%;flex-direction: column; font-size: 2em;'>"+
                            "<p style='margin:0'>"+item.name+"</p>"+
                            // ( !isNil(item.shareholding_ratio__c) ? shareholdingRatio : '')
                            ( item.shareholding_ratio__c ? shareholdingRatio : '')
                            +"</div>";
                return {
                    "nodeId": item._id,
                    // "parentNodeId": item.parent || item.parent__c,
                    "parentNodeId": item[parentFieldName],
                    "width": 342,
                    "height": 146,
                    "borderWidth": 1,
                    "borderRadius": 5,
                    "borderColor": {
                        "red": 15,
                        "green": 140,
                        "blue": 121,
                        "alpha": 1
                    },
                    "backgroundColor": {
                        "red": 51,
                        "green": 182,
                        "blue": 208,
                        "alpha": 1
                    },
                    // "template": "<div style='display: flex;justify-content: center;align-items: center;height: 100%; font-size: 2em;'>" + item.name + "</div>",
                    "template": templateContent,
                    "connectorLineColor": {
                        "red": 220,
                        "green": 189,
                        "blue": 207,
                        "alpha": 1
                    },
                    "connectorLineWidth": 5,
                    "dashArray": "",
                    "expanded": (!item.parent__c || item.parent__c === rootNodeId) ? true : false,
                    "directSubordinates": 4,
                    "totalSubordinates": 1515
                }
            });
            if(!flag && results.length != 1){
                results = [];
                setErrorMessage('未找到parentFieldName对应的记录！')
            }
            else{
                setErrorMessage('')
            }
        }
        setData(results);
    }

    useEffect(() => {
        // loadData("60cc421853d43707e44ce106");
        loadData(rootId);
    }, [true]);

    return (
        <div style={{height: '100%'}}>
            { !errorMessage ?
                (<OrgChartComponent
                    setClick={click => (addNodeChildFunc = click)}
                    onNodeClick={onNodeClick}
                    data={data}
                // data={Data}
                // data={Tree}
                // data={convertedResults}
                />)
                : (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>{ errorMessage }</div>)
            }
        </div>
    );
});