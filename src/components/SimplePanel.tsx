import React from 'react';

import { load } from 'web-component-load';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import {
  useStyles2,
  //  useTheme2 
} from '@grafana/ui';

interface Props extends PanelProps<SimpleOptions> { }

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
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
  // const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const [flowData, setFlowData] = React.useState({
    actors: [
      // {
      //   id: 'A',
      //   displayedTitle: 'some A-letter'
      // }
    ],
    data: [{
      messageID: 1,
      source: 'A',
      destination: 'B',
    },
    // {
    //   messageID: 'some unique Id as string 1',
    //   title: 'Title',
    //   subTitle: 'subTitle',
    //   aboveArrow: 'aboveArrow',
    //   belowArrow: 'belowArrow',
    //   source: 'B',
    //   destination: 'C',
    // },
    {
      messageID: 'some unique Id as string 2',
      source: 'C',
      destination: 'B',
      sourceLabel: 'S L',
      destinationLabel: 'D L'
    },
    {
      messageID: 'some unique Id as string 3',
      source: 'B',
      destination: 'B',
    }]
  });
  React.useEffect(() => {
    load("http://localhost:4200");
    const outData = (data as any)?.series?.[0]?.fields[0].values.buffer ;
    if(outData) {
      setFlowData({actors: [], data: outData.map(i => {
        /*
        container
        : 
        "elegant-kalam"
        dst
        : 
        "charming-pascal"
        level
        : 
        "info"
        sender
        : 
        "logtest"
        src
        : 
        "goofy-merkle"
        */
        return {
          messageID: `${i.container} / ${i.level} / ${i.sender}`,
          source: i.src,
          destination: i.dst,
          // sourceLabel: 'S L',
          // destinationLabel: 'D L'
        }
      })
    }
    )
    }
    console.log(data, outData)

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
      {/* <h1>TEST3 EDIK</h1> */}
      

      <ngx-flow-out data-flow={JSON.stringify(flowData)} />

      {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
      {/* <p>{JSON.stringify(options)}</p> */}
      <div className={styles.textBox}>
        {options.showSeriesCount && <div>Number of series: {data.series.length}</div>}
        <div>Text option value: {options.text}</div>
      </div>
    </div>
  );
};
