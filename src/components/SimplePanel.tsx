import React from 'react';
/* eslint-disable-next-line */
// import { load } from 'web-component-load';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import './../../ngx-flow/widget/ngx-flow.js';
import {
  useStyles2,
  //  useTheme2 
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
  };
};

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  const [flowData, setFlowData] = React.useState({
    actors: [],
    data: [{
      messageID: 1,
      source: 'A',
      destination: 'B',
    }]
  });
  React.useEffect(() => {
    const fields = (data as any)?.series?.[0]?.fields;
    console.log({ fields })
    if (fields) {
      const outData = fields[0]?.values.buffer;
      if (outData) {
        setFlowData({
          actors: [], data: outData.map((i: any, k: number) => {
            const message = fields.find((j: any) => j.name === 'Line')?.values?.buffer?.[k];
            return {
              messageID: `${i.container} / ${i.level} / ${i.sender}`,
              source: i.src || '...',
              destination: i.dst || '...',
              title: i.container,
              subTitle: message,
              aboveArrow: i.level,
              belowArrow: i.sender,
            }
          })
        }
        )
        console.log(data, outData)
      }
    }
    /* eslint-disable-next-line */
  }, []);

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
      <ngx-flow-out data-flow={JSON.stringify(flowData)} />
      <div className={styles.textBox}>
        {options.showSeriesCount && <div>Number of series: {data.series.length}</div>}
        <div>Text option value: {options.text}</div>
      </div>
    </div>
  );
};
