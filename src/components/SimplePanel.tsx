import React from 'react';
import { PanelProps, StandardEditorProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import './../../ngx-flow/widget/ngx-flow.js';
import ReactJson from 'react-json-view';

import {
  Button,
  MultiSelect,
  Collapse,
  // AsyncSelect,
  Modal,
  useStyles2,
  useTheme2
} from '@grafana/ui';



interface Props extends PanelProps<SimpleOptions> { }

type CustomElement<T> = Partial<T & React.DOMAttributes<T> & { children: any }>;

declare global {
  /* eslint-disable-next-line */
  namespace JSX {
    interface IntrinsicElements {
      ['ngx-flow-out']: CustomElement<any>;
    }
  }
}
export let valueLabelsName: string[] = [];
let bufferCheck = '';
export const TemplateEditor = ({ value, onChange }: StandardEditorProps<string>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const themeName: string = useTheme2().name;
  const styles = useStyles2(getStyles);
  const templateData = JSON.stringify({
    actors: [], data: [{
      messageID: 'messageID',
      subTitle: 'subTitle',
      source: 'source',
      destination: 'destination',
      title: 'title',
      aboveArrow: 'aboveArrow',
      belowArrow: 'belowArrow',
      sourceLabel: 'sourceLabel',
      destinationLabel: 'destinationLabel',
    }]
  });
  return <Collapse label="Template" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
    <div className={cx(
      styles.wrapper, css`
    height: 250px;
    `)}>
      <ngx-flow-out data-flow={templateData} theme={themeName} />
    </div>
  </Collapse>;
}
export const SimpleEditor = ({ value, onChange }: StandardEditorProps<string[]>) => {
  const [selectValue, setSelectValue] = React.useState<any>();
  const [forRerender, setForRerender] = React.useState<any>(0);

  if (bufferCheck !== JSON.stringify(valueLabelsName) || valueLabelsName?.length === 0) {
    setTimeout(() => {
      bufferCheck = JSON.stringify(valueLabelsName)
      setSelectValue(value);
      setForRerender(forRerender + 1);
    }, 200)
  }

  return <MultiSelect
    options={valueLabelsName.map((i: any) => ({ label: i, value: i }))}
    value={selectValue}
    onChange={(v: any[]) => {
      setSelectValue(v);
      onChange(v.map((j: any) => j.value));
    }}
  />;
};

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    label: css`
      background-color: rgba(128, 128, 128, 0.1);
    `,
    pre: css`
      white-space: pre-wrap;
    `
  };
};

export const DetaiItem: React.FC<any> = ({ item, theme }: any): JSX.Element | null => {
  let [key, value]: any = item;
  const themeName: any = theme === 'Dark' ? 'railscasts' : 'rjv-default'
  let isJSON = false;
  const styles = useStyles2(getStyles);
  const isTimestamp = (new Date(value)).getTime() > 0;
  if (isTimestamp) {
    value = `${new Date(value).toISOString()} | ${value}`;
  }
  try {
    isJSON = typeof JSON.parse(value) === 'object';
  } catch (e) { }

  return (<div>
    {value ? <>
      <strong className={styles.label}>{key}</strong>
      {isJSON ?
        <pre>
          <ReactJson
            src={JSON.parse(value)}
            theme={themeName}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={({ src }) => {
              navigator.clipboard.writeText(JSON.stringify(src))
            }}
            quotesOnKeys={false}
            name={false}

          />
        </pre> :
        <pre className={styles.pre}>{value}</pre>
      }
    </> : <>
    </>}

  </div>);
}
let ngxFlowClickHandler: Function = function () { };

document.addEventListener('ngx-flow-click-item', function (e: any) {
  // console.log('ngx-flow-click-item::details');
  ngxFlowClickHandler(e)
});

function formattingDataAndSortIt(data: any, sortType = 'none') {
  const [firstField] = data;
  const unSortData = firstField.values.map((i: any, k: number) => {
    const outData: any = {};
    data.forEach((item: any) => {
      outData[item.name] = item.values[k];
    });
    if (outData?.Time && typeof outData?.labels === 'object') {
      outData['labels'].timestamp = outData.Time;
    } 
    return outData;
  })
  if (sortType === 'none') {
    return unSortData;
  }
  const sortData = unSortData.sort((itemA: any, itemB: any) => {
    const a = itemA.Time;
    const b = itemB.Time;
    return a < b ? -1 : a > b ? 1 : 0;
  });
  if (sortType === 'time_old') {
    return sortData;
  }

  if (sortType === 'time_new') {
    return sortData.reverse();
  }

}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }: any) => {
  const [flowData, setFlowData] = React.useState({ actors: [], data: [] });
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({});
  const [modalDataFields, setModalDataFields] = React.useState([]);

  const onModalClose = () => {
    setModalIsOpen(false);
  };

  const styles = useStyles2(getStyles);
  React.useEffect(() => {
    const [serie]: any = (data as any)?.series || [];
    const fields = serie?.fields || [];
    console.log({ options })
    if (fields) {
      const [firsField]: any = fields;
      const sortData = formattingDataAndSortIt(fields, options.sortoption);
      // console.log({ fields }, sortData);
      setModalDataFields(sortData);
      const outData = firsField?.values;

      valueLabelsName = Object.keys(outData[0]);

      if (outData) {
        setFlowData({
          actors: [], data: sortData.map((item: any) => {
            const message: string = item.Line || '';
            const labelItem: any = item.labels;
            const _ = (optionArr: string[] | string) => {
              if (optionArr instanceof Array) {
                return optionArr.map((option: string) => labelItem[option]).filter((a: any) => !!a).join(':');
              }
              return labelItem[optionArr];
            };
            return {
              messageID: _(options.colorGenerator) || 'Title',
              subTitle: options.showbody && message,
              source: _(options.source) || '...',
              destination: _(options.destination) || '...',
              title: _(options.title) || '',
              aboveArrow: _(options.aboveArrow) || '',
              belowArrow: _(options.belowArrow) || '',
              sourceLabel: _(options.sourceLabel) || '',
              destinationLabel: _(options.destinationLabel) || ''
            }
          })
        })

      }
    }
    /* eslint-disable-next-line */
  }, [data, options]);

  ngxFlowClickHandler = (e: any) => {
    const details: any = modalDataFields[e.detail];
    if (typeof details.labels === 'object') {
      details.labels = JSON.stringify(details.labels);
    }
    setModalData(details);
    setModalIsOpen(true);
  };

  // console.log(useTheme2());
  const themeName: string = useTheme2().name;
  const flowDataJSON = JSON.stringify(flowData);
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {/* <pre>{JSON.stringify(flowData)}</pre> */}
      {/* <FlowMemo flowData={flowData} themeName={themeName} /> */}
      <ngx-flow-out data-flow={flowDataJSON} theme={themeName} />

      <Modal title="Message Details" isOpen={modalIsOpen} onDismiss={onModalClose}>
        {modalData && Object.entries(modalData).map((item: any, key: number) => (
          // <p>{item} | {key}</p>
          <DetaiItem item={item} key={key} theme={themeName} />
        ))}
        <Button variant="primary" onClick={onModalClose}>
          Close
        </Button>
      </Modal>

    </div>
  );
};
