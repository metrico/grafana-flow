import { cx, css } from "@emotion/css";
import { StandardEditorProps } from "@grafana/data";
import { useTheme2, useStyles2, Collapse } from "@grafana/ui";
import React, { useState } from "react";
const getStyles = () => {
    return {
        wrapper: css`
      font-family: Open Sans;
      position: relative;
    `
    };
};

export const TemplateEditor = ({ value, onChange }: StandardEditorProps<string>) => {
    const [isOpen, setIsOpen] = useState(false);
    const themeName: string = useTheme2().name;
    const styles = useStyles2(getStyles);

    const templateData = JSON.stringify({
        actors: [], data: [{
            messageID: 'messageID',
            details: 'details',
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
