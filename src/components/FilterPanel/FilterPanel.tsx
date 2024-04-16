import { css, cx } from "@emotion/css";
import { PanelData } from "@grafana/data";
import { Button, Checkbox, Collapse, HorizontalGroup, InlineSwitch, Toggletip, useTheme2, Tooltip } from "@grafana/ui";
import React, { useEffect, useState } from "react";

export interface FilterProps {
    data: PanelData
    onFilter: Function
    onSimplify: Function
    options: any
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
    },
    callid: {
        [key: string]: boolean
    }
}
export interface Filter {
    name: string
    value: boolean
}
export const FilterPanel = ({ data, onFilter, onSimplify, options }: FilterProps) => {
    const [ipsArray, setIpsArray] = useState<string[]>([]);
    // const [portsArray, setPortsArray] = useState<string[]>([]);
    // const [ipPortsArray, setIpPortsArray] = useState<string[]>([]);
    const [methodsArray, setMethodsArray] = useState<string[]>([]);
    const [payloadTypesArray, setPayloadTypesArray] = useState<string[]>([]);
    const [callidsArray, setCallidsArray] = useState<string[]>([]);
    const [filters, setFilters] = useState<Filters>({ ip: {}, port: {}, ipPort: {}, method: {}, type: {}, callid: {} });
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
        const callid = new Set<string>()
        labelValues?.forEach((label) => {
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
            if (label.callid !== undefined) {
                callid.add(label.callid)
            }
        })
        setIpsArray(Array.from(ips))
        // setPortsArray(Array.from(ports))
        // setIpPortsArray(Array.from(ipPorts))
        setMethodsArray(Array.from(methods))
        setPayloadTypesArray(Array.from(payloadType))
        setCallidsArray(Array.from(callid))
        setFilters({
            ip: Object.fromEntries([...ips].map(ip => [ip, true])),
            port: Object.fromEntries([...ports].map(port => [port, true])),
            ipPort: Object.fromEntries([...ipPorts].map(ipPort => [ipPort, true])),
            method: Object.fromEntries([...methods].map(method => [method, true])),
            type: Object.fromEntries([...payloadType].map(type => [type, true])),
            callid: Object.fromEntries([...callid].map(callid => [callid, true])),
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
            <Tooltip
                content={`Changes display to simple format, which is more compact and doesn't have ${options?.aboveArrow} ${options?.belowArrow && options?.aboveArrow ? 'and' : ''} ${options?.aboveArrow} ${options?.belowArrow} labels`} placement="top">
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
            {payloadTypesArray.length > 0 &&
                <MyCollapse label="Payload type" filterState={filters} filterProperty={'type'} setFilters={setFilters} filterLabel={"type"}>
                <HorizontalGroup spacing="md" >
                    {payloadTypesArray.map((payloadType) => (
                        <Checkbox value={filters?.type?.[payloadType]} key={payloadType} defaultChecked={true} label={payloadType} onChange={(v) => {
                            setFilters({ ...filters, type: { ...filters.type, [payloadType]: (v.target as HTMLInputElement).checked } })
                        }} />
                    ))}
                </HorizontalGroup>
            </MyCollapse>
            }
            {methodsArray.length > 0 &&
                <MyCollapse label="Method" filterState={filters} filterProperty={'method'} setFilters={setFilters} filterLabel={"response"}>
                <HorizontalGroup spacing="md" wrap={true}>
                    {methodsArray.map((method) => (
                        <Checkbox value={filters?.method?.[method]} key={method} defaultChecked={true} label={method} onChange={(v) => {
                            setFilters({ ...filters, method: { ...filters.method, [method]: (v.target as HTMLInputElement).checked } })
                        }} />
                    ))}
                </HorizontalGroup>
            </MyCollapse>
            }
            {ipsArray.length > 0 &&
                <MyCollapse label="IP" filterState={filters} filterProperty={'ip'} setFilters={setFilters} filterLabel={`src_ip" or "dst_ip`}>
                <HorizontalGroup spacing="md" wrap={true}>
                    {ipsArray.map((ip) => (
                        <Checkbox value={filters?.ip?.[ip]} key={ip} defaultChecked={true} label={ip} onChange={(v) => setFilters({ ...filters, ip: { ...filters.ip, [ip]: (v.target as HTMLInputElement).checked } })} />
                    ))}
                </HorizontalGroup>
            </MyCollapse>
            }
            {callidsArray.length > 0 &&
                <MyCollapse label="Call ID" filterState={filters} filterProperty={'callid'} setFilters={setFilters} filterLabel={`callid`}>
                    <HorizontalGroup spacing="md" wrap={true}>
                        {callidsArray.map((callid) => (
                            <Checkbox value={filters?.callid?.[callid]} key={callid} defaultChecked={true} label={callid} onChange={(v) => setFilters({ ...filters, callid: { ...filters.callid, [callid]: (v.target as HTMLInputElement).checked } })} />

                        ))}

                    </HorizontalGroup>
                </MyCollapse>
            }
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
                  border: 1px solid ${themeName === 'Dark' ? 'hsla(240, 18.6%, 83.1%, 0.12)' : 'hsla(210, 12.2%, 16.1%, 0.12)'};
                  border-radius: 2px;
                  background-color: ${themeName === 'Dark' ? 'hsla(0, 0%, 0%, 0.3)' : 'hsla(0, 0%, 100%, 0.3)'};
                `)} id="filter" icon="filter" fill="text" variant="secondary" />
        </Toggletip>

    )
}
interface MyCollapseProps {
    label: string;
    children: React.ReactNode;
    filterState: any;
    filterProperty: string;
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    filterLabel: string;
}
const MyCollapse = ({ label, children, filterState, filterProperty, setFilters, filterLabel }: MyCollapseProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [checked, setChecked] = useState(false)
    useEffect(() => {
        let count = 0
        const keys = Object.values(filterState[filterProperty])
        keys.forEach(item => {
            if (item) {
                count += 1
            }
        })
        console.log(count, keys.length, filterState[filterProperty])
        setIndeterminate(count > 0 && count < keys.length)
        setChecked(count === keys.length)
    }, [filterState, filterProperty])
    const setFilterState = () => {

        setFilters(() => ({
            ...filterState,
            [filterProperty]: Object.fromEntries(
                Object.entries(filterState[filterProperty]).map(([key]) => [key, !checked])
            ),
        }));

    } 
    return (
        <Tooltip content={`Filters by "${filterLabel}" label`}>

        <span style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '28px', top: '8px', display: 'flex' }}>
                <Checkbox indeterminate={indeterminate} checked={checked} onChange={setFilterState} /> <span style={{ zIndex: 1 }}>{label}</span>
            </span>
            <Collapse collapsible={true} isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} label={''}>
            {children}
        </Collapse>
        </span>
        </Tooltip>
    )
}
