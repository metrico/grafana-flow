import { SelectableValue } from "@grafana/data";
import { Card, InlineField, Input, MultiSelect } from "@grafana/ui";
import React, { useEffect, useRef, useState } from "react";
import { XYCoord, useDrag, useDrop } from "react-dnd";
import type { Identifier } from 'dnd-core'
import { ParsedLabel } from "../DataScheme";
import { css } from "@emotion/css";
import { CustomOption } from "./CustomOption";
import { MultiValueLabel } from "./CustomLabel";
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
export const ParsedViewEntry = ({ parsedLabel: { title, tooltip, labels, separator }, labelList, index, setDataSchemeValue, moveCard, isDragMode, setIsDragMode }: Props) => {
    const ref = useRef<HTMLSpanElement>(null)
    const styles = getStyles()
    const [optionsState, setOptionsState] = useState<Array<SelectableValue<any>>>([])

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
        setOptionsState(groupArray.concat(options2));

    }, [labelList])
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
    })
    setIsDragMode(isDragging)
    drag(drop(ref))
    const labelWidth = 9
    return (
        <span ref={ref} style={{ pointerEvents: !isDragging && isDragMode ? 'none' : 'all', opacity: isDragging ? 0 : 1, cursor: 'grab', position: 'relative' }} data-handler-id={handlerId} >
            <Card>
                <Card.Description>
                    <InlineField label="Title" labelWidth={labelWidth} grow={true}>
                        <Input value={title} onChange={(e) => {
                            setDataSchemeValue(prev => {
                                const newValue = [...prev]
                                newValue[index].title = e.currentTarget.value
                                return newValue
                            })
                        }} />
                    </InlineField>
                    <InlineField label="Tooltip" labelWidth={labelWidth} grow={true}>
                        <Input value={tooltip} onChange={(e) => {
                            setDataSchemeValue(prev => {
                                const newValue = [...prev]
                                newValue[index].tooltip = e.currentTarget.value
                                return newValue
                            })
                        }} />
                    </InlineField>
                    <InlineField label="Labels" labelWidth={labelWidth} grow={true}>
                        <MultiSelect
                            isClearable={true}
                            options={optionsState}
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
                            <Input value={separator} onChange={(e) => {
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
