import { formatFiltersToODataQuery } from '@steedos/filters';
import { buildQueryString } from './utils/helpers';
import { Filters, Fields, Options, Record, ODataQuery } from './types/sobject';

import _ from 'underscore';

export default class SObject {
    client: any;
    objectName: string;
    config: any;
    constructor(client, objectName){
        this.client = client;
        this.objectName = objectName;
    }

    private getFilter(filters: Filters){
        if(_.isArray(filters)){
            let userContext: any = {};
            userContext.userId = this.client.getUserId();
            userContext.spaceId = this.client.getSpaceId();
            userContext.user = {}; //TODU:当前用户userSession
            return formatFiltersToODataQuery(filters, userContext)
        }
        return filters;
    }

    private getSelect(fields){
        if(_.isArray(fields)){
            return fields.toString()
        }
        return fields;
    }

    private getQueryParams(filters: Filters, fields: Fields, options: Options){
        let params: ODataQuery = {};
        const $filter = this.getFilter(filters);
        if($filter){
            params.$filter = $filter
        }
        const $select = this.getSelect(fields);
        if($select){
            params.$select = $select
        }
        if(options && options.expand){
            params.$expand = options.expand
        }
        if(options){
            if(options.pageSize){
                params.$top = options.pageSize;
            }
            // current是从1开始的页码索引
            if(options.current && options.pageSize){
                params.$skip = (options.current - 1) * options.pageSize;
            }
            let sortIsNull:any;
            if(typeof options.sort === 'string'){
                sortIsNull=options.sort;
            }else if(_.isArray(options.sort)){
                let order = _.map(options.sort,(value)=>{
                    let order2 = value[1]==='desc' ? value[0] + ' desc' : value[0];
                    return order2;
                }).join(",")
                sortIsNull=order;
            }
            if(sortIsNull){
                params.$orderby=sortIsNull;
            }
        }
        return params;
    }

    async getConfig(){
        // const url = `${this.client.getBootstrapRoute()}/${this.objectName}`;
        const url = `${this.client.getUrl()}/service/api/@${this.objectName}/uiSchema`;
        return await this.client.doFetch(url, {method: 'get'});
    }

    async getRecordPermissions(recordId){
        const url = `${this.client.getUrl()}/service/api/@${this.objectName}/recordPermissions/${recordId}`;
        return await this.client.doFetch(url, {method: 'get'});
    }

    /**
     * Find and fetch records which matches given conditions
     *
     * @param {String|Array} [filters] - filtering records
     * @param {String|Array} [fields] - Fields to fetch.
     * @param {Object} [options] - Query options.
     * @param {Number} [options.$top] - Maximum number of records the query will return.
     * @param {Number} [options.$skip] - Synonym of options.offset.
     * @param {String} [options.$orderby] - sorting.
     * @param {boolean} [options.$count] - count.
     * @returns {Promise<Array<Record>>}
     */
    async find(filters: Filters, fields: Fields, options: Options){
        let params = this.getQueryParams(filters, fields, options);
        let url = this.client.getBaseRoute() + "/api/v4/".concat(this.objectName) + buildQueryString(params);
        let result = await this.client.doFetch(url, {method: 'get'});
        return result
    }

    /**
     * TODO 根据条件查询数据，返回1条($top = 1)。
     * @param filters 
     * @param fields 
     * @param options 
     * @returns {Promise<Record>}
     */
    async findOne(filters: Filters, fields: Fields, options: Options){

    }

    /**
     * TODO 根据id查询数据。
     * @param id 
     * @param fields 
     */
    async record(id: string, fields: Fields){
        
    }

    /**
     * TODO 根据ids查询数据。
     * @param ids 
     * @param fields 
     */
    async retrieve(ids: Array<string>, fields: Fields){

    }

    /**
     * TODO 写入数据，并返回新记录
     * @param data 
     */
    async insert(data: Record){
        let url = `${this.client.getBaseRoute()}/api/v4/${this.objectName}`;
        let result = await this.client.doFetch(url, {method: 'POST', body: JSON.stringify(data)});
        return result.value;
    }

    /**
     * TODO 根据id，修改记录，并返回新记录
     * @param id 
     * @param data 
     */
    async update(id: string, data: Record){
        let url = `${this.client.getBaseRoute()}/api/v4/${this.objectName}/${id}`;
        let result = await this.client.doFetch(url, {method: 'put', body: JSON.stringify(data)});
        return result.value;
    }

    /**
     * TODO 根据id, 删除记录
     * @param id 
     */
    async delete(id: string){
        let url = `${this.client.getBaseRoute()}/api/v4/${this.objectName}/${id}`;
        let result = await this.client.doFetch(url, {method: 'delete'});
        return result
    }

    /**
     * TODO 返回满足条件的记录数
     * @param filters 
     */
    async count(filters: Filters){

    }

    // 预留
    // recent(){}
}