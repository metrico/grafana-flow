import { AppEvents, PanelData } from "@grafana/data";
import { Button, Icon, Modal, ToolbarButton, ToolbarButtonRow } from "@grafana/ui";
import { parseDataIntoListOfFields } from "helpers/dataProcessors/parseDataIntoListOfFields";
import React, { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ParsedLabel } from "../DataScheme";
import { ParsedViewEntry } from "./Entry";
import { uuid } from "helpers/uuid";
import { saveAs } from "helpers/saveAs";
import { validateDataScheme } from "./validateDataScheme";
// @ts-ignore
import appEvents from 'grafana/app/core/app_events';
interface Props {
    isModalOpen: boolean
    onModalClose: (doSave: boolean) => void
    data: any
    setDataSchemeValue: React.Dispatch<React.SetStateAction<ParsedLabel[]>>
    dataScheme: ParsedLabel[]
    fullData: PanelData
}
export const ConfigureParsedViewModal = ({ isModalOpen, onModalClose, data, setDataSchemeValue, dataScheme, fullData }: Props) => {

    const [labelList, setLabelList] = useState<any[]>([])
    useEffect(() => {
        const labelMap = new Map<string, string>()
        fullData.series.forEach((item) => {
            item.fields.forEach((field) => {
                field.values.forEach((value) => {
                    if (value === null) {
                        return
                    }
                    parseDataIntoListOfFields(value, labelMap, field.name)
                })
            })
        })
        setLabelList(Array.from(labelMap.values()))
    }, [fullData])
    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        setDataSchemeValue((prevCards: ParsedLabel[]) => {
            const newCards = [...prevCards]
            newCards.splice(dragIndex, 1)
            newCards.splice(hoverIndex, 0, prevCards[dragIndex])
            return newCards
        })
    }, [setDataSchemeValue])
    const addCard = useCallback(() => {
        setDataSchemeValue((prevCards: ParsedLabel[]) => [...prevCards,
        { labels: [], title: '', tooltip: '', separator: '', UUID: uuid() }])
    }, [setDataSchemeValue])
    const exportDataScheme = (data: any) => {
        const dataStr = JSON.stringify(data, null, 4);
        const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "exported-data-scheme.json");
    }
    const importDataScheme = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const text = e.target.result;
                try {
                    const data = JSON.parse(text);
                    if (validateDataScheme(data)) {
                        setDataSchemeValue(data)
                        appEvents.emit(AppEvents.alertSuccess, ["Imported successfully"])
                    }
                } catch (error) {

                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    const [isDragMode, setIsDragMode] = useState(false)
    return (
        <DndProvider backend={HTML5Backend}>
            <Modal title="Configure Parsed View" isOpen={isModalOpen} onDismiss={() => onModalClose(false)}>
                <ToolbarButtonRow>
                    <ToolbarButton variant="default" iconOnly={true} icon={'cloud-download'} tooltip="Export current configuration" onClick={() => exportDataScheme(dataScheme)} />
                    <ToolbarButton icon={"cloud-upload"} iconOnly={true} tooltip="Import new configuration" variant="default" onClick={() => importDataScheme()} />
                </ToolbarButtonRow>
                {dataScheme.map((item, index) => (
                    <ParsedViewEntry isDragMode={isDragMode} setIsDragMode={setIsDragMode} moveCard={moveCard} key={item.UUID} parsedLabel={item} index={index} setDataSchemeValue={setDataSchemeValue} labelList={labelList} />
                ))}
                <div></div> {/* to prevent the last entry from collapsing to smaller size */}
                <Button variant="primary" style={{ width: '100%', marginBottom: '10px' }} fullWidth={true} onClick={() => addCard()}>
                    <Icon name="plus" />
                    Add new label
                </Button>
                <Button variant="secondary" onClick={() => onModalClose(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => onModalClose(true)}>
                    Save
                </Button>
            </Modal>
        </DndProvider >
    )
}
