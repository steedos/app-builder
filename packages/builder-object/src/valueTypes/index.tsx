import { boolean } from './boolean';
import { currency } from './currency';
import { currency_range } from './currency_range';
import { date } from './date';
import { date_range } from './date_range';
import { datetime } from './datetime';
import { datetime_range } from './datetime_range';
import { email } from './email';
import { number } from './number';
import { number_range } from './number_range';
import { percent } from './percent';
import { select } from './select';
import { toggle } from './toggle';
import { url } from './url';
import { lookup } from './lookup';
import { master_detail } from './master_detail';
import { object } from './object';
import { grid } from './grid';
import { image } from './image';
import { file } from './file';
import { avatar } from './avatar';
import { formula } from './formula';
import { summary } from './summary';
import { autonumber } from './autonumber';
import { ComponentRegistry } from "@steedos/builder-store";
import { defaultsDeep } from 'lodash';

export const StandardValueTypes = {
    boolean,
    currency,
    currency_range,
    // date,//放开会出现死循环，不放开功能正常
    date_range,
    datetime,
    datetime_range,
    email,
    number,
    number_range,
    percent,
    select,
    toggle,
    url,
    lookup,
    master_detail,
    image,
    file,
    avatar,
    object,
    grid,
    formula,
    summary,
    autonumber,
};
ComponentRegistry.valueTypes = defaultsDeep({}, ComponentRegistry.valueTypes, StandardValueTypes);