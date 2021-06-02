import { ComponentRegistry } from '@steedos/builder-store';
import { ObjectTable, ObjectForm, ObjectListView} from '@steedos/builder-object';

Object.assign(ComponentRegistry.components,{ ObjectForm, ObjectTable, ObjectListView });

export { ObjectTable, ObjectForm, API, SteedosProvider, SteedosRouter, Forms, ObjectListView} from '@steedos/builder-object';
export { ObjectGrid } from '@steedos/builder-ag-grid';
export { ComponentRegistry }
