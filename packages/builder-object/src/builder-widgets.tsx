

import { Builder, withChildren } from '@builder.io/react';
import { ObjectForm} from './components';
import { configObjectForm } from './components/ObjectForm.config';

Builder.registerComponent(withChildren(ObjectForm), configObjectForm);

// registerObjectTableComponent(["name"]);
