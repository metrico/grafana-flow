import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import './../../ngx-flow/widget/ngx-flow.js';
import ReactJson from 'react-json-view';

import {
  Button,
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
    `
  };
};

export const DetaiItem: React.FC<any> = ({ item, theme }: any): JSX.Element | null => {
  const [key, value]: any = item;
  const themeName: any = theme === 'Dark' ? 'railscasts' : 'rjv-default'
  console.log({ item })
  let isJSON = false;
  const styles = useStyles2(getStyles);

  try {
    isJSON = typeof JSON.parse(value) === 'object';
  } catch (e) { }

  return (<div>
    <strong className={styles.label}>{key}</strong>
    {isJSON ?
      <ReactJson src={JSON.parse(value)} theme={themeName} /> :
      <p>{value}</p>
    }

  </div>);
}
let ngxFlowClickHandler: Function = function () { };
document.addEventListener('ngx-flow-click-item', function (e: any) {
  console.log('ngx-flow-click-item::details');
  ngxFlowClickHandler(e)
});

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
    const fields = (data as any)?.series?.[0]?.fields;
    setModalDataFields(fields);
    if (fields) {
      const outData = fields[0]?.values.buffer;
      if (outData) {
        setFlowData({
          actors: [], data: outData.map((i: any, k: number) => {
            console.log(fields.find((j: any) => j.name === 'Line')?.values);
            const message = fields.find((j: any) => j.name === 'Line')?.values?.buffer?.[k] || '';

            return {
              messageID: `${i[options.source] || ''}${i[options.title] || ''}` || 'Title',
              subTitle: message,
              source: i[options.source] || '...',
              destination: i[options.destination] || '...',
              title: i[options.title] || '',
              aboveArrow: i[options.aboveArrow] || '',
              belowArrow: i[options.belowArrow] || '',
              sourceLabel: i[options.sourceLabel] || '',
              destinationLabel: i[options.destinationLabel] || ''
            }
          })
        })

      }
    }
    /* eslint-disable-next-line */
  }, [data, options]);

  ngxFlowClickHandler = (e: any) => {
    const details: any = {};
    modalDataFields.forEach((i: any) => {
      let val = i.values.buffer[e.detail];
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      details[i.name] = val;
    })
    console.log(details);
    setModalData(details);
    setModalIsOpen(true);
  };

  console.log(useTheme2());
  const themeName = useTheme2().name;
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
      <ngx-flow-out data-flow={JSON.stringify(flowData)} theme={themeName} />

      <Modal title="Message Details" isOpen={modalIsOpen} onDismiss={onModalClose}>
        {modalData && Object.entries(modalData).map((item: any, key: number) => (
          <DetaiItem item={item} key={key} theme={themeName} />
        ))}
        <Button variant="primary" onClick={onModalClose}>
          Close
        </Button>
      </Modal>

    </div>
  );
};
