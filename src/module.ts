import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel, SimpleEditor, TemplateEditor } from './components/SimplePanel';


export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  console.log('---builder---', { builder });

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
      description: 'String above Arrow (Labels[key])',
      defaultValue: '',
      editor: SimpleEditor,
    })
    .addCustomEditor({
      id: 'belowArrow',
      path: 'belowArrow',
      name: 'Below Arrow',
      description: 'String below arrow (Labels[key])',
      defaultValue: '',
      editor: SimpleEditor,
    })
    .addCustomEditor({
      id: 'source',
      path: 'source',
      name: 'Source',
      description: 'String source (Labels[key])',
      defaultValue: '',
      editor: SimpleEditor,
    })
    .addCustomEditor({
      id: 'sourceLabel',
      path: 'sourceLabel',
      name: 'Source Label',
      description: 'String source label (Labels[key])',
      defaultValue: '',
      editor: SimpleEditor,
    })
    .addCustomEditor({
      id: 'destination',
      path: 'destination',
      name: 'Destination',
      description: 'String destination (Labels[key])',
      defaultValue: '',
      editor: SimpleEditor,
    })
    .addCustomEditor({
      id: 'destinationLabel',
      path: 'destinationLabel',
      name: 'Destination Label',
      description: 'String destination label (Labels[key])',
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
    .addBooleanSwitch({
      path: 'showbody',
      name: 'Show body [Line] value',
      defaultValue: false,
    })

});
