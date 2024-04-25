import { css } from "@emotion/css";
import { useStyles2 } from "@grafana/ui";
import { CopyText } from "components/CopyText/CopyText";
import React, { useRef, useState } from "react";
import ReactJson from "react-json-view";
const getStyles = () => {
    return {

        label: css`
      background-color: rgba(128, 128, 128, 0.1);
    `,
        pre: css`
      white-space: pre-wrap;
    `
    };
};

export const DetailItem: React.FC<any> = ({ item, theme }: any): JSX.Element | null => {
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
    const textAreaRef: any = useRef(null);

    function copyToClipboard() {
        if (textAreaRef && textAreaRef.current) {
            textAreaRef.current.focus();
            textAreaRef.current.select();
            document.execCommand('copy');
        }
    };
    const [copyValue, setCopyValue] = useState('')
    return (<div>
        <textarea
            ref={textAreaRef} value={copyValue} style={{ pointerEvents: 'none', opacity: 0, position: 'fixed', left: 0, top: 0, border: 0, padding: 0 }} />
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
                            let textToCopy = JSON.stringify(src);
                            if (textToCopy.startsWith("\"") && textToCopy.endsWith("\"")) {
                                textToCopy = textToCopy.substring(1, textToCopy.length - 1);
                            }
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(textToCopy)
                            } else {
                                setCopyValue(textToCopy)
                                setTimeout(() => {
                                    copyToClipboard()
                                }, 0);
                            }
                        }}
                        quotesOnKeys={false}
                        name={false}

                    />
                </pre> :
                <span style={{ position: 'relative' }}>
                    <pre className={styles.pre}>
                        {value}
                    </pre>
                    <span style={{ position: 'absolute', right: 15, top: 32 }}>

                        <CopyText text={value} />
                    </span>
                </span>
            }
        </> : <>
        </>}

    </div>);
}
