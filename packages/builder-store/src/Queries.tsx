import { flow, types } from "mobx-state-tree";
import { API } from './API';
import _ from 'lodash';


export const QueryModel = types.model({
    id: types.identifier,
    isLoading: true,
    data: types.frozen()
}).actions((self) => {
    const loadData = flow(function* loadData(queryId) {
        try {
            const results = yield API.client.doFetch(API.client.getUrl() + `/service/api/~packages-@steedos/charts/queries/${queryId}/results`, { method: 'post' });
            let data = {
                columns: [],
                rows: results
            }
            let columns = [];
            _.each(results, function(result){
                columns = _.union(_.concat(columns, _.keys(result))); 
            })

            _.each(columns, function(column){
                data.columns.push({type: '', name: column})
            })
            self.data = data
            self.isLoading = false
        } catch (error) {
            console.error("Failed to fetch apps/menus", error)
        }
    })
    return {
        loadData
    }
})

export const Queries = types.model({
    Queries: types.optional(types.map(QueryModel), {})
}).actions((self) => {
    return {
        getData: function(queryId){
            if(!queryId){
                return null;
            }
            const query = self.Queries.get(queryId);
            if(query){
                return query;
            }
            const newQuery = QueryModel.create({
                id: queryId,
                data: [],
                isLoading: true
            })
            self.Queries.put(newQuery);
            newQuery.loadData(queryId);
            return newQuery;
        },
    }
}).create()
