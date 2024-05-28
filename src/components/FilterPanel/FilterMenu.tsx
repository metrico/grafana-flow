import { cx, css } from "@emotion/css";
import { Tooltip, InlineSwitch, HorizontalGroup, Checkbox } from "@grafana/ui";
import React from "react";
import { FilterCollapse } from "./Collapse";
import { FilterKeys, Filters } from "./FilterPanel";
import { useNotification } from "hooks/useNotification";
interface Props {

    filters: Filters
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    isSimplify: boolean
    setIsSimplify: React.Dispatch<React.SetStateAction<boolean>>;
    options: any
}
export function FilterMenu({ filters, setFilters, isSimplify, setIsSimplify, options }: Props) {
    const { warning } = useNotification()
    return (<span
        className={cx(
            css`
          display: flex;
          flex-direction: column;
          width: 370px;
        `
        )}
    >
        <Tooltip
            content={`Changes display to simple format, which is more compact and doesn't have "${options?.aboveArrow}" ${options?.belowArrow && options?.aboveArrow ? 'and' : ''} "${options?.belowArrow}" labels`} placement="top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
                <InlineSwitch
                    showLabel={true}
                    defaultChecked={false}
                    value={isSimplify}
                    onChange={() => { setIsSimplify(!isSimplify); }}
                    label="Simple format" />
            </span>
        </Tooltip>
        <hr />
        {Object.entries(filters).map(([key, filter]) => (

            <FilterCollapse key={key} title={filter.title} filterState={filters} label={key} setFilters={setFilters} tooltip={filter.tooltip} >
                <HorizontalGroup spacing="md" wrap={true}>
                    {Array.from(filter.values.entries()).map(([label, checked]) => (
                        <Checkbox value={checked} key={label} defaultChecked={true} label={label} onChange={(v) => {
                            setFilters(prevState => {
                                const filter = prevState[key as FilterKeys]
                                const newFilterValues = new Map(filter.values)
                                newFilterValues.set(label, (v.target as HTMLInputElement).checked)
                                const isAnyChecked = Array.from(newFilterValues.values()).includes(true)
                                if (!isAnyChecked) {
                                    warning('There must be at least one checked option')
                                    return prevState
                                }
                                return {
                                    ...prevState,
                                    [key]: {
                                        ...filter,
                                        values: newFilterValues
                                    }
                                }
                            })
                        }}></Checkbox>
                    ))}
                </HorizontalGroup>
            </FilterCollapse>
        ))

        }
    </span>)
}
