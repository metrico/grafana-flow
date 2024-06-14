import { SelectableValue } from "@grafana/data";
import { Card, InlineField, Input, MultiSelect, Select } from "@grafana/ui";
import React, { useEffect, useRef, useState } from "react";
import { XYCoord, useDrag, useDrop } from "react-dnd";
import type { Identifier } from 'dnd-core'
import { ParsedLabel } from "../DataScheme";
import { css } from "@emotion/css";
import { CustomOption } from "./CustomOption";
import { MultiValueLabel } from "./CustomLabel";
import { parserConfigs, parsers } from "../Parsers/parsers";
interface Props {
    parsedLabel: ParsedLabel
    labelList: any[]
    index: number
    setDataSchemeValue: React.Dispatch<React.SetStateAction<ParsedLabel[]>>
    moveCard: (dragIndex: number, hoverIndex: number) => void
    isDragMode: boolean
    setIsDragMode: React.Dispatch<React.SetStateAction<boolean>>
}
const getStyles = () => {

    return {
        dragHandle: css`
            position: absolute;
            top: calc(50% - 30px);
            left: 8px;
            width: 8px;
            height: 60px;
            border: 3px dotted hsl(214, 12%, 30%);
            border-bottom: none;
            border-top: none;

        `
    }
}
export const ParsedViewEntry = ({ parsedLabel: { title, tooltip, labels, separator, parser, parserConfig }, labelList, index, setDataSchemeValue, moveCard, isDragMode, setIsDragMode }: Props) => {
    const ref = useRef<HTMLSpanElement>(null)
    const styles = getStyles()
    const [labelOptionsState, setLabelOptionsState] = useState<Array<SelectableValue<any>>>([])
    const [preventDrag, setPreventDrag] = useState(false)
    const [parserOptionsState, _setParsersOptionsState] = useState<Array<SelectableValue<any>>>(Object.keys(parsers).map((key) => ({ label: key, value: key })))
    const [parserConfigOptionsState, setParserConfigOptionsState] = useState<Array<SelectableValue<any>>>([])
    useEffect(() => {
        const groups = new Map<string, any>()
        const options2: Array<SelectableValue<any>> = []
        labelList.sort((a, b) => b.depth - a.depth).forEach((item) => {
            if (item.group !== '') {
                if (!groups.get(item.group)) {
                    const key = item.parentGroup ? `${item.parentGroup}.${item.group}` : item.group
                    groups.set(item.group, { label: item.group, parentGroup: item.parentGroup, options: [{ label: `Full \`${item.group}\` object`, value: key }] })
                }
                groups.get(item.group)?.options?.push({
                    label: item.label,
                    parentGroup: item.parentGroup,
                    value: item.key
                })

            } else {
                options2.push({
                    label: item.label,
                    value: item.key
                })
            }
        })
        const groupArray: Array<SelectableValue<any>> = []
        groups.forEach((item, key) => {
            groupArray.push(item)
        })
        setLabelOptionsState(groupArray.concat(options2));

    }, [labelList])
    useEffect(() => {
        if (typeof parser !== 'undefined' && parserConfigs[parser as keyof typeof parserConfigs]) {
            setParserConfigOptionsState(parserConfigs[parser as keyof typeof parserConfigs])
        }
    }, [parser])
    const [{ handlerId }, drop] = useDrop<
        any,
        void,
        { handlerId: Identifier | null }
    >({
        accept: 'Entry',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: any, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: 'Entry',
        item: () => {
            return { title, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => !preventDrag
    })
    setIsDragMode(isDragging)
    drag(drop(ref))
    const labelWidth = 9
    return (
        <span ref={ref} style={{ pointerEvents: !isDragging && isDragMode ? 'none' : 'all', opacity: isDragging ? 0 : 1, cursor: 'grab', position: 'relative' }} data-handler-id={handlerId} >
            <Card>
                <Card.Description>
                    <InlineField label="Title" labelWidth={labelWidth} grow={true}>
                        <Input
                            onMouseDown={() => { setPreventDrag(true) }} onMouseUp={() => { setPreventDrag(false) }}
                            value={title} onChange={(e) => {
                            setDataSchemeValue(prev => {
                                const newValue = [...prev]
                                newValue[index].title = e.currentTarget.value
                                return newValue
                            })
                        }} />
                    </InlineField>
                    <InlineField label="Tooltip" labelWidth={labelWidth} grow={true}>
                        <Input
                            onMouseDown={() => { setPreventDrag(true) }} onMouseUp={() => { setPreventDrag(false) }}
                            value={tooltip} onChange={(e) => {
                            setDataSchemeValue(prev => {
                                const newValue = [...prev]
                                newValue[index].tooltip = e.currentTarget.value
                                return newValue
                            })
                        }} />
                    </InlineField>
                    <InlineField label="Parser" labelWidth={labelWidth} grow={true}>
                        <Select
                            isClearable={true}
                            options={parserOptionsState}
                            value={parser}
                            maxMenuHeight={480}
                            components={{ Option: CustomOption, MultiValueLabel: MultiValueLabel }}
                            onChange={(v) => {
                                setDataSchemeValue(prev => {
                                    const newValue = [...prev]
                                    newValue[index].parser = v.value
                                    delete newValue[index].parserConfig
                                    return newValue
                                })
                            }}
                        />
                    </InlineField>
                    {parser && parserConfigOptionsState.length > 0 &&
                        <InlineField label="Parser" labelWidth={labelWidth} grow={true}>
                            <Select
                                isClearable={true}
                                options={parserConfigOptionsState}
                                value={parserConfig}
                                maxMenuHeight={480}
                                components={{ Option: CustomOption, MultiValueLabel: MultiValueLabel }}
                                onChange={(v) => {
                                    setDataSchemeValue(prev => {
                                        const newValue = [...prev]
                                        newValue[index].parserConfig = v.value
                                        return newValue
                                    })
                                }}
                            />
                        </InlineField>
                    }
                    <InlineField label="Labels" labelWidth={labelWidth} grow={true}>
                        <MultiSelect 
                            isClearable={true}
                            options={labelOptionsState}
                            value={labels}
                            maxMenuHeight={480}
                            components={{ Option: CustomOption, MultiValueLabel: MultiValueLabel }}
                            onChange={(v: any[]) => {
                                setDataSchemeValue(prev => {
                                    const newValue = [...prev]
                                    newValue[index].labels = v.map((i: any) => i.value)
                                    return newValue
                                })
                            }}
                        />
                    </InlineField>

                    {labels.length > 1 &&
                        <InlineField label="Separator" labelWidth={labelWidth} grow={true}>
                            <Input
                                onMouseDown={() => { setPreventDrag(true) }} onMouseUp={() => { setPreventDrag(false) }}
                                value={separator} onChange={(e) => {
                                setDataSchemeValue(prev => {
                                    const newValue = [...prev]
                                    newValue[index].separator = e.currentTarget.value
                                    return newValue
                                })
                            }} />
                        </InlineField>
                    }
                </Card.Description>
            </Card>
            <span className={styles.dragHandle}>

            </span>
        </span>
    )
}
