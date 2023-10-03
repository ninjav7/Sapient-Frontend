import Select from './index';
import { Default } from './stories/single';
import { Multi } from './stories/multi';

export default {
    title: 'Components/DropdownInput',
    component: Select,
    parameters: {
        controls: { disable: true },
    },
};

export { Default, Multi };
