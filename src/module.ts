import { PanelPlugin } from '@grafana/data';
import { FlowPanel } from './components/FlowPanel';
import { FlowOptions } from './types';
import { TemplateEditor, MultiSelectEditor, MultiSelectEditorAPI } from 'components/PluginSettings';
;




export const plugin = new PanelPlugin<FlowOptions>(FlowPanel).setPanelOptions((builder) => {
    return builder
        .addCustomEditor({
            id: 'db_table',
            path: 'db_table',
            name: 'DB TABLE',
            description: 'DB NAME OF TABLE',
            defaultValue: '',
            editor: MultiSelectEditorAPI,
        })
        .addCustomEditor({
            id: 'search_fields',
            path: 'search_fields',
            name: 'Set Search Fields',
            description: 'Search fields for search by column of db',
            defaultValue: '',
            editor: MultiSelectEditor,
        })
        // SEARCH FIELDS
        // .addTextInput({
        //     path: 'call_id',
        //     name: 'CALL ID',
        //     // description: 'Label used to determine end of an arrow',
        //     defaultValue: '',
        // })
        // .addTextInput({
        //     path: 'from_user',
        //     name: 'From-User',
        //     // description: 'Label used to determine end of an arrow',
        //     defaultValue: '',
        // })
        // .addTextInput({
        //     path: 'to_user',
        //     name: 'To-User',
        //     // description: 'Label used to determine end of an arrow',
        //     defaultValue: '',
        // })
        // .addTextInput({
        //     path: 'method',
        //     name: 'METHOD',
        //     defaultValue: '',
        // })
        // [END] SEARCH FIELDS

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
            editor: MultiSelectEditor,
        })
        .addCustomEditor({
            id: 'aboveArrow',
            path: 'aboveArrow',
            name: 'Above Arrow',
            description: 'Label directly above an arrow (hidden in simple format)',
            defaultValue: '',
            editor: MultiSelectEditor,
        })
        .addCustomEditor({
            id: 'belowArrow',
            path: 'belowArrow',
            name: 'Below Arrow',
            description: 'Label directly below an arrow (hidden in simple format)',
            defaultValue: '',
            editor: MultiSelectEditor,
        })
        .addCustomEditor({
            id: 'details',
            path: 'details',
            name: 'Details',
            description: 'Label 2 lines below an arrow',
            defaultValue: ['timestamp'],
            editor: MultiSelectEditor,
        })
        .addCustomEditor({
            id: 'sourceLabel',
            path: 'sourceLabel',
            name: 'Source Label',
            description: 'Label at the beginning of an arrow',
            defaultValue: '',
            editor: MultiSelectEditor,
        })
        .addCustomEditor({
            id: 'destinationLabel',
            path: 'destinationLabel',
            name: 'Destination Label',
            description: 'Label at the end of an arrow',
            defaultValue: '',
            editor: MultiSelectEditor,
        })
        .addCustomEditor({
            id: 'source',
            path: 'source',
            name: 'Source Host',
            defaultValue: 'Label used to determine beginning of an arrow',
            editor: MultiSelectEditor,
        })
        .addCustomEditor({
            id: 'destination',
            path: 'destination',
            name: 'Destination Host',
            description: 'Label used to determine end of an arrow',
            defaultValue: '',
            editor: MultiSelectEditor,
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
            editor: MultiSelectEditor,
        })
        .addBooleanSwitch({
            path: 'showbody',
            name: 'Show body [Line] value',
            defaultValue: false,
        })

});
