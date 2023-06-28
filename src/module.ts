import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'title',
      name: 'Title',
      description: 'Title of flow item',
      defaultValue: '',
    })
    .addTextInput({
      path: 'aboveArrow',
      name: 'Above Arrow',
      description: 'String above Arrow (Labels[key])',
      defaultValue: '',
    })
    .addTextInput({
      path: 'belowArrow',
      name: 'Below Arrow',
      description: 'String below arrow (Labels[key])',
      defaultValue: '',
    })
    .addTextInput({
      path: 'source',
      name: 'Source',
      description: 'String source (Labels[key])',
      defaultValue: '',
    })
    .addTextInput({
      path: 'sourceLabel',
      name: 'Source Label',
      description: 'String source label (Labels[key])',
      defaultValue: '',
    })
    .addTextInput({
      path: 'destination',
      name: 'Destination',
      description: 'String destination (Labels[key])',
      defaultValue: '',
    })
    .addTextInput({
      path: 'destinationLabel',
      name: 'Destination Label',
      description: 'String destination label (Labels[key])',
      defaultValue: '',
    })



    // .addTextInput({
    //   path: 'text2',
    //   name: 'Simple text option 2',
    //   description: 'Description of panel option',
    //   defaultValue: '',
    // })
    // .addTextInput({
    //   path: 'text3',
    //   name: 'Simple text option 3',
    //   description: 'Description of panel option',
    //   defaultValue: '',
    // })
    // .addBooleanSwitch({
    //   path: 'showSeriesCount',
    //   name: 'Show series counter',
    //   defaultValue: false,
    // })
    // .addRadio({
    //   path: 'seriesCountSize',
    //   defaultValue: 'sm',
    //   name: 'Series counter size',
    //   settings: {
    //     options: [
    //       {
    //         value: 'sm',
    //         label: 'Small',
    //       },
    //       {
    //         value: 'md',
    //         label: 'Medium',
    //       },
    //       {
    //         value: 'lg',
    //         label: 'Large',
    //       },
    //     ],
    //   },
    //   showIf: (config) => config.showSeriesCount,
    // });
});
