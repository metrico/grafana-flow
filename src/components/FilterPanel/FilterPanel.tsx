import { css, cx } from "@emotion/css";
import { PanelData } from "@grafana/data";
import { Button, Checkbox, Collapse, HorizontalGroup, InlineSwitch, Toggletip, useTheme2 } from "@grafana/ui";
import React, { useEffect, useState } from "react";

export interface FilterProps {
    data: PanelData
    onFilter: Function
    onSimplify: Function
}
export interface Filters {
    ip: {
        [key: string]: boolean
    },
    port: {
        [key: string]: boolean
    },
    ipPort: {
        [key: string]: boolean
    },
    method: {
        [key: string]: boolean
    },
    type: {
        [key: string]: boolean
    }
}
export interface Filter {
    name: string
    value: boolean
}
export const FilterPanel = ({ data, onFilter, onSimplify }: FilterProps) => {
    const [ipsArray, setIpsArray] = useState<string[]>([]);
    // const [portsArray, setPortsArray] = useState<string[]>([]);
    // const [ipPortsArray, setIpPortsArray] = useState<string[]>([]);
    const [methodsArray, setMethodsArray] = useState<string[]>([]);
    const [payloadTypesArray, setPayloadTypesArray] = useState<string[]>([]);
    const [filters, setFilters] = useState<Filters>({ ip: {}, port: {}, ipPort: {}, method: {}, type: {} })
    const [isSimplify, setIsSimplify] = useState(false);
    useEffect(() => {
        const [serie] = data.series || [];
        const fields = serie?.fields || [];
        const labelsField = fields[0]
        const labelValues = labelsField?.values
        const ips = new Set<string>()
        const ports = new Set<string>()
        const ipPorts = new Set<string>()
        const methods = new Set<string>()
        const payloadType = new Set<string>()
        labelValues.forEach((label) => {
            ips.add(label.dst_ip)
            ips.add(label.src_ip)
            ports.add(label.dst_port)
            ports.add(label.src_port)
            ipPorts.add(label.dst_ip + ':' + label.dst_port)
            ipPorts.add(label.src_ip + ':' + label.src_port)
            if (label.response !== undefined) {
                methods.add(label.response)
            }
            payloadType.add(label.type)
        })
        setIpsArray(Array.from(ips))
        // setPortsArray(Array.from(ports))
        // setIpPortsArray(Array.from(ipPorts))
        setMethodsArray(Array.from(methods))
        setPayloadTypesArray(Array.from(payloadType))
        setFilters({
            ip: Object.fromEntries([...ips].map(ip => [ip, true])),
            port: Object.fromEntries([...ports].map(port => [port, true])),
            ipPort: Object.fromEntries([...ipPorts].map(ipPort => [ipPort, true])),
            method: Object.fromEntries([...methods].map(method => [method, true])),
            type: Object.fromEntries([...payloadType].map(type => [type, true])),
        })
    }, [data])
    useEffect(() => {
        onSimplify(isSimplify)
        onFilter(filters)
    }, [filters, isSimplify, onFilter, onSimplify])
    const menu = (
        <span
            className={cx(
                css`
                  display: flex;
                  flex-direction: column;
                  width: 350px;
                `
            )}
        >
            <InlineSwitch showLabel={true} defaultChecked={false} value={isSimplify} onChange={() => { setIsSimplify(!isSimplify); }} label="Simple format" />
            <hr />
            <MyCollapse label="Payload type">
                <HorizontalGroup spacing="md" >
                    {payloadTypesArray.map((payloadType) => (
                        <Checkbox value={filters?.type?.[payloadType]} key={payloadType} defaultChecked={true} label={payloadType} onChange={(v) => {
                            setFilters({ ...filters, type: { ...filters.type, [payloadType]: (v.target as HTMLInputElement).checked } })
                        }} />
                    ))}
                </HorizontalGroup>
            </MyCollapse>
            <MyCollapse label="Method">
                <HorizontalGroup spacing="md" wrap={true}>
                    {methodsArray.map((method) => (
                        <Checkbox value={filters?.method?.[method]} key={method} defaultChecked={true} label={method} onChange={(v) => {
                            setFilters({ ...filters, method: { ...filters.method, [method]: (v.target as HTMLInputElement).checked } })
                        }} />
                    ))}
                </HorizontalGroup>
            </MyCollapse>

            <MyCollapse label="IP">
                <HorizontalGroup spacing="md" wrap={true}>
                    {ipsArray.map((ip) => (
                        <Checkbox value={filters?.ip?.[ip]} key={ip} defaultChecked={true} label={ip} onChange={(v) => setFilters({ ...filters, ip: { ...filters.ip, [ip]: (v.target as HTMLInputElement).checked } })} />
                    ))}
                </HorizontalGroup>
            </MyCollapse>
        </span>
    );
    const themeName: string = useTheme2().name;
    return (
        <Toggletip
            content={menu}
            closeButton={false}
            placement="left"
            onClose={() => { onFilter(filters); onSimplify(isSimplify) }}
        >
            <Button className={cx(css`
                  position: absolute;
                  top: 15px;
                  right: 40px;
                  border: 1px solid ${themeName === 'Dark' ? 'hsla(240, 18.6%, 83.1%, 0.12)' : 'hsla(210, 12.2%, 16.1%, 0.12)'};
                  border-radius: 2px;
                  background-color: ${themeName === 'Dark' ? 'hsla(0, 0%, 0%, 0.5)' : 'hsla(0, 0%, 100%, 0.5)'};
                  z-index: 2;
                `)} id="filter" icon="filter" fill="text" variant="secondary" />
        </Toggletip>

    )
}
const MyCollapse = ({ label, children }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Collapse collapsible={true} isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} label={label}>
            {children}
        </Collapse>
    )
}
