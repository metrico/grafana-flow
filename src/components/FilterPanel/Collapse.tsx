import { Checkbox, Collapse, Icon, Tooltip } from "@grafana/ui";
import React, { useEffect, useState } from "react";
import { FilterKeys, Filters } from "./FilterPanel";
import { css } from "@emotion/css";
const getStyles = () => {
    return {
        collapseChildrenWrapper: css`
      padding-left: 18px;
      width: 100%;
      height: 100%;
    `, collapse: css`
      max-width: unset;`

    };
};
interface MyCollapseProps {
    title: string;
    children: React.ReactNode;
    filterState: Filters;
    label: string;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    tooltip: string;
}
export const FilterCollapse = ({ title, children, filterState, label, setFilters, tooltip }: MyCollapseProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [checked, setChecked] = useState(false)
    useEffect(() => {
        let count = 0
        const keys = filterState[label as FilterKeys].values
        keys.forEach(item => {
            if (item) {
                count += 1
            }
        })
        setIndeterminate(count > 0 && count < keys.size)
        setChecked(count === keys.size)
    }, [filterState, label])
    const setFilterState = () => {
        setFilters(prevState => {
            const filter = prevState[label as FilterKeys]
            const newFilterValues = new Map(filter.values)
            filter.values.forEach((value, key) => {
                newFilterValues.set(key, !checked)
            })
            return {
                ...prevState,
                [label]: {
                    ...filter,
                    values: newFilterValues
                }
            }
        })

    }
    return (

        <span style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '28px', right: 0, top: '10px', display: 'flex', alignItems: 'center' }}>
                <Checkbox indeterminate={indeterminate} checked={checked} onChange={setFilterState} />
                <span style={{ zIndex: 1, marginLeft: '8px', pointerEvents: 'none' }}>{title}</span>

                <Tooltip content={`${tooltip}`}>
                    <Icon name="question-circle" style={{ zIndex: 1, position: 'absolute', right: '10px' }} size="xl"></Icon>
                </Tooltip>
            </span>
            <Collapse collapsible={true} isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} label={''}>
                <div className={getStyles().collapseChildrenWrapper}>

                    {children}
                </div>
            </Collapse>
        </span>
    )
}
