import { formatFiltersToODataQuery } from '@steedos/filters';
import { buildQueryString } from './utils/helpers';
import { Filters, Fields, Options, Record, ODataQuery } from './types/sobject';

const _ = require('underscore');

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
            return formatFiltersToODataQuery(filters)
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
        if(options){
            if(options.pageSize){
                params.$top = options.pageSize;
            }
            if(options.current){
                params.$skip = options.current * options.pageSize;
            }
            if(typeof options.sort === 'string'){
                params.$orderby = options.sort;
            }
        }
        // $top?: Number,
        // $skip?: Number,
        // $orderby?: Number,

        //   pageSize: number,
        //   current: number,
        //   sort: any
        return params;
    }

    async getConfig(){
        const url = `${this.client.getBootstrapRoute()}/${this.objectName}`;
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