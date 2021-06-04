import { ComponentRegistry } from '@steedos/builder-store';
import { ObjectTable, ObjectProTable,
    ObjectForm, ObjectListView,
    SpaceUsers, SpaceUsersModal,
    Organizations, OrganizationsModal,
    ObjectTree, ObjectExpandTable, ObjectModal
} from '@steedos/builder-object';

Object.assign(ComponentRegistry.components,{ 
    ObjectTable, ObjectProTable,
    ObjectForm, ObjectListView,
    SpaceUsers, SpaceUsersModal,
    Organizations, OrganizationsModal,
    ObjectTree, ObjectExpandTable, ObjectModal
});

export { ObjectTable, ObjectForm, API, SteedosProvider, SteedosRouter, Forms, ObjectListView} from '@steedos/builder-object';
export { ObjectGrid } from '@steedos/builder-ag-grid';
export { ComponentRegistry }
