import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel, SimpleEditor, TemplateEditor } from './components/SimplePanel';


export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
    return builder
        .addCustomEditor({
            id: 'Template',
            path: 'Template',
            name: '',
            editor: TemplateEditor,
        })
        .addCustomEditor({
            id: 'title',
            path: 'title',
            name: 'Title',
            description: 'Title of flow item',
            defaultValue: '',
            editor: SimpleEditor,
        })
        .addCustomEditor({
            id: 'aboveArrow',
            path: 'aboveArrow',
            name: 'Above Arrow',
            description: 'Label directly above an arrow (hidden in simple format)',
            defaultValue: '',
            editor: SimpleEditor,
        })
        .addCustomEditor({
            id: 'belowArrow',
            path: 'belowArrow',
            name: 'Below Arrow',
            description: 'Label directly below an arrow (hidden in simple format)',
            defaultValue: '',
            editor: SimpleEditor,
        })
        .addCustomEditor({
            id: 'details',
            path: 'details',
            name: 'Details',
            description: 'Label 2 lines below an arrow',
            defaultValue: ['timestamp'],
            editor: SimpleEditor,
        })
        .addCustomEditor({
            id: 'sourceLabel',
            path: 'sourceLabel',
            name: 'Source Label',
            description: 'Label at the beginning of an arrow',
            defaultValue: '',
            editor: SimpleEditor,
        })
        .addCustomEditor({
            id: 'destinationLabel',
            path: 'destinationLabel',
            name: 'Destination Label',
            description: 'Label at the end of an arrow',
            defaultValue: '',
            editor: SimpleEditor,
        })
        .addCustomEditor({
            id: 'source',
            path: 'source',
            name: 'Source Host',
            defaultValue: 'Label used to determine beginning of an arrow',
            editor: SimpleEditor,
        })
        .addCustomEditor({
            id: 'destination',
            path: 'destination',
            name: 'Destination Host',
            description: 'Label used to determine end of an arrow',
            defaultValue: '',
            editor: SimpleEditor,
        })
        .addSelect({
            // id: 'sortoption',
            path: 'sortoption',
            name: 'Sort items',
            defaultValue: 'none',
            settings: {
                options: [
                    { value: 'none', label: 'not sorted' },
                    { value: 'time_new', label: 'Sort by Time: Newest first' },
                    { value: 'time_old', label: 'Sort by Time: Oldest first' }
                ]
            },
        })
        .addCustomEditor({
            id: 'colorGenerator',
            path: 'colorGenerator',
            name: 'Items for color generator',
            description: 'Which labels should be used for background color generation',
            defaultValue: '',
            editor: SimpleEditor,
        })
        .addBooleanSwitch({
            path: 'showbody',
            name: 'Show body [Line] value',
            defaultValue: false,
        })

});
