import { flow, types } from "mobx-state-tree";
import { API } from './API';
import { each, union, concat, keys} from 'lodash';


export const QueryModel = types.model({
    id: types.identifier,
    isLoading: true,
    data: types.frozen()
}).actions((self) => {
    const loadData = flow(function* loadData(queryId) {
        try {
            const results = yield API.client.doFetch(API.client.getUrl() + `/service/api/~packages-@steedos/service-charts/queries/${queryId}/results`, { method: 'post' });
            let data = {
                columns: [],
                rows: results
            }
            let columns = [];
            each(results, function(result){
                columns = union(concat(columns, keys(result))); 
            })

            each(columns, function(column){
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
