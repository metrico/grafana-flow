import { Modal, Button, InlineSwitch, Tooltip, IconButton } from "@grafana/ui"
import React, { useCallback, useEffect, useState } from "react"
import { DetailItem } from "./DetailItem"
import { ParsedView } from "./ParsedView/ParsedView"
import { ConfigureParsedViewModal } from "./ParsedView/Configure/ConfigureParsedView"
import { ParsedLabel, dataScheme } from "./ParsedView/DataScheme"
import { PanelData } from "@grafana/data"
import { getBackendSrv } from "@grafana/runtime"

interface FlowModalProps {
    modalIsOpen: boolean
    modalData: any
    onModalClose: () => void
    themeName: string
    fullData: PanelData
}
export const FlowModal = ({ modalIsOpen, modalData, onModalClose, themeName, fullData }: FlowModalProps) => {
    const [isParsed, setIsParsed] = useState(true)
    const [isParsedViewModalOpen, setIsParsedViewModalOpen] = useState(false)
    const [dataSchemeValue, setDataSchemeValue] = useState<ParsedLabel[]>([])
    useEffect(() => {
        setDataSchemeValue(dataScheme)
        getBackendSrv().get(`api/plugins/qxip-flow-panel/settings`).then((data: any) => {
            if (data?.jsonData?.parsedViewConfiguration && data?.jsonData?.parsedViewConfiguration.length > 0) {
                setDataSchemeValue(data.jsonData.parsedViewConfiguration)
            }
        })
    }, [])
    const onConfigureModalClose = useCallback((doSave: boolean) => {
        setIsParsedViewModalOpen(false)
        const fitleredDataScheme = dataSchemeValue.filter((item) => item.labels.length > 0)
        setDataSchemeValue(fitleredDataScheme)
        console.log(fitleredDataScheme)
        if (doSave) {
            getBackendSrv().post(`api/plugins/qxip-flow-panel/settings`,
                {
                    jsonData: {
                        parsedViewConfiguration: fitleredDataScheme
                    },
                    pinned: true
                });
        }
    }, [dataSchemeValue])
    return (
        <Modal title="Message Details" isOpen={modalIsOpen} onDismiss={onModalClose}>
            <Tooltip
                content={`Displays a parsed view of the message`} placement="top">
                <span style={{ display: 'flex', flexDirection: 'column', position: 'relative', marginBottom: '16px', width: 'calc(100% + 5px)', marginRight: '-5px' }}>
                    <InlineSwitch
                        showLabel={true}
                        defaultChecked={false}
                        value={isParsed}
                        onChange={() => { setIsParsed(!isParsed); }}
                        label="Parsed view" />
                    <IconButton style={{ position: 'absolute', right: '10px', top: '7px' }} name="cog" variant="secondary" onClick={() => setIsParsedViewModalOpen(true)} />
                    <ConfigureParsedViewModal fullData={fullData} dataScheme={dataSchemeValue} setDataSchemeValue={setDataSchemeValue} isModalOpen={isParsedViewModalOpen} onModalClose={onConfigureModalClose} data={modalData} />
                </span>
            </Tooltip>
            {isParsed && <ParsedView data={modalData} theme={themeName} dataScheme={dataSchemeValue} />}
            {!isParsed && modalData && Object.entries(modalData).map((item: any, index: number) => (
                <DetailItem item={item} key={index} theme={themeName} />
            ))}
            <Button variant="primary" onClick={onModalClose}>
                Close
            </Button>
        </Modal>
    )
}
