import { Modal, Button } from "@grafana/ui"
import React from "react"
import { DetailItem } from "./DetailItem"

interface FlowModalProps {
    modalIsOpen: boolean
    modalData: any
    onModalClose: () => void
    themeName: string
}
export const FlowModal = ({ modalIsOpen, modalData, onModalClose, themeName }: FlowModalProps) => {
    return (
        <Modal title="Message Details" isOpen={modalIsOpen} onDismiss={onModalClose}>
            {modalData && Object.entries(modalData).map((item: any, key: number) => (
                // <p>{item} | {key}</p>
                <DetailItem item={item} key={key} theme={themeName} />
            ))}
            <Button variant="primary" onClick={onModalClose}>
                Close
            </Button>
        </Modal>
    )
}
