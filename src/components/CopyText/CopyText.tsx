import React, { FC, useRef, useState } from 'react';
import { IconButton } from '@grafana/ui';


export const CopyText: FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const textAreaRef: any = useRef(null);
    const copy = () => {
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopied(true);
        } else {
            if (textAreaRef && textAreaRef.current) {
                textAreaRef.current.focus();
                textAreaRef.current.select();
                document.execCommand('copy');
            }
            setCopied(false);
        }
    };
    return (
        <>
            <textarea
                ref={textAreaRef} value={text} style={{ pointerEvents: 'none', opacity: 0, position: 'fixed', left: 0, top: 0, border: 0, padding: 0 }} />

            <IconButton
                name="copy"
                tooltip={copied ? 'Copied!' : 'Copy'}
                onClick={copy}
            />
        </>
    )
}
