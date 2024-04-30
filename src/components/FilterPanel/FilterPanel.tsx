import { css, cx } from "@emotion/css";
import { PanelData } from "@grafana/data";
import { Button, Toggletip, useTheme2 } from "@grafana/ui";
import React, { useEffect, useState } from "react";
import { FilterMenu } from "./FilterMenu";

export interface FilterProps {
    data: PanelData
    onFilter: Function
    onSimplify: Function
    options: any
}
export type FilterKeys = "ip" /* | "port" | "ipPort"  */ | "method" | "type" | "callid"
export type Filters = {
    [key in FilterKeys]: Filter
}
const getDefaultFilterTooltip = (label: string): string => {
    return `Filter by ${label}`
}

export interface Filter {
    label: string
    tooltip: string
    title: string
    values: Map<string, boolean>
}

export const defaultFilters: Filters = {
    ip: {
        label: "ip",
        tooltip: getDefaultFilterTooltip(`"dst_ip or src_ip"`),
        values: new Map<string, boolean>(),
        title: "IP"
    },
    method: {
        label: "method",
        tooltip: getDefaultFilterTooltip(`"response"`),
        values: new Map<string, boolean>(),
        title: "Method"
    },
    type: {
        label: "type",
        tooltip: getDefaultFilterTooltip(`"type"`),
        values: new Map<string, boolean>(),
        title: "Payload Type"
    },
    callid: {
        label: "callid",
        tooltip: getDefaultFilterTooltip(`"callid"`),
        values: new Map<string, boolean>(),
        title: "Callid"
    },
}
export const FilterPanel = ({ data, onFilter, onSimplify, options }: FilterProps) => {
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isSimplify, setIsSimplify] = useState(false);
    useEffect(() => {
        const [serie] = data.series || [];
        const fields = serie?.fields || [];
        const labelsField = fields[0]
        const labelValues = labelsField?.values
        const ips = new Map<string, boolean>()
        const ports = new Map<string, boolean>()
        const ipPorts = new Map<string, boolean>()
        const methods = new Map<string, boolean>()
        const payloadType = new Map<string, boolean>()
        const callid = new Map<string, boolean>()
        labelValues?.forEach((label) => {
            ips.set(label.dst_ip, true)
            ips.set(label.src_ip, true)
            ports.set(label.dst_port, true)
            ports.set(label.src_port, true)
            ipPorts.set(label.dst_ip + ':' + label.dst_port, true)
            ipPorts.set(label.src_ip + ':' + label.src_port, true)
            if (label.response !== undefined) {
                methods.set(label.response, true)
            }
            payloadType.set(label.type, true)
            if (label.callid !== undefined) {
                callid.set(label.callid, true)
            }
        })
        const getArrayOfValues = (prevValues: Map<string, boolean>, values: Map<string, boolean>) => {
            const newMap = new Map<string, boolean>()
            values.forEach((value, key) => {
                newMap.set(key, prevValues.get(key) ?? value)

            })
            return newMap
        }
        setFilters((prev) => {
            const newFilters = { ...defaultFilters };
            newFilters.ip.values = getArrayOfValues(prev.ip.values, ips)
            // newFilters.port.values = getArrayOfValues(ports)
            // newFilters.ipPort.values = getArrayOfValues(ipPorts)
            newFilters.method.values = getArrayOfValues(prev.method.values, methods)
            newFilters.type.values = getArrayOfValues(prev.type.values, payloadType)
            newFilters.callid.values = getArrayOfValues(prev.callid.values, callid)
            return newFilters
        })
    }, [data])
    useEffect(() => {
        onSimplify(isSimplify)
        onFilter(filters)
    }, [filters, isSimplify, onFilter, onSimplify])
    const menu = (
        <FilterMenu filters={filters} setFilters={setFilters} isSimplify={isSimplify} setIsSimplify={setIsSimplify} options={options}></FilterMenu>
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
