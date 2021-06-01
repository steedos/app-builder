import { JsonMap } from './json';

export type Filters = string | Array<any>

export type Fields = string | Array<string>

export type Options = {
    pageSize: number,
    current: number,
    sort: any,
    $top?: number,
    $skip?: number,
    $orderby?: number,
    $count?: boolean,
    $filter?: Filters,
    $select?: Fields,
    expand?: string
}

export type ODataQuery = {
    $top?: number,
    $skip?: number,
    $orderby?: string,
    $count?: boolean,
    $filter?: Filters,
    $select?: Fields,
    $expand?: string
}

export type Record = JsonMap

