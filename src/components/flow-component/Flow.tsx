import React, { useEffect, useMemo, useState } from 'react';
import { FlowPolygon } from './FlowPolygon';
import { FlowHostsLine } from './Flow-hosts-line';
import FlowItem from './Flow-item';
import { FlowData } from './flow.model';
// import { MessagesDialog } from "@/features/messages-table/messages-dialog";
// import {
//   all_cols,
//   addMessageIds,
//   formatMessageDetails,
// } from "@/features/messages-table/cols";
import { FlowItemType, getMethodColor, getColorByString, mosColorBlink } from './flow-utils';
import './Flow.css';
import { cloneObject } from '../../helpers/functions';
import { hash } from 'helpers/hash';
// import { PanelProps } from '@grafana/data';

// Define types for better code quality
// interface FlowProps extends PanelProps {
//   formattingData: any;
//   filters: any;
// }

// interface DialogRow {
//   id: number;
//   data: any;
//   position: { x: number; y: number };
//   isOpen: boolean;
//   hasPrev: boolean;
//   hasNext: boolean;
//   background: string;
//   zIndex?: number;
// }
// interface FlowData extands FlowProps {

// }
class FormatterData {
  _formattedData: any;
  constructor() {}
  formatter(data: FlowData | null = null) {
    let actors = data?.actors || null;
    let dataSimple: any[] = data?.data as any[];
    const sourceArray = dataSimple.map((i) => i.source);
    const destinationArray = dataSimple.map((i) => i.destination);
    const uniqHostName = [...sourceArray, ...destinationArray].sort().filter((i, k, arr) => i !== arr[k + 1]);

    const hosts = uniqHostName.map((i, k) => this.makeHost(i, k, actors));
    const messages = dataSimple.map((i) => this.formatItem(i, i.source, i.destination, hosts));
    this._formattedData = { hosts, messages };
    return this._formattedData;
  }

  makeHost(name: string, i = 0, actors: any[] | null = null) {
    // console.log({ actors });
    const actor = actors?.find((j: any) => j.id === name)?.displayedTitle;
    return {
      name: name,
      alias: actor || name,
      host: `1.0.0.${i}:${i}`,
      ip: `1.0.0.${i}`,
      port: i,
      isIPv4: true,
      position: i,
    };
  }
  formatItem(i: any, SRC: any, DIST: any, hosts: any) {
    const src = hosts.find((i: any) => i.name === SRC);
    const dist = hosts.find((i: any) => i.name === DIST);

    return {
      callid: hash((i.messageID || i.title) + ''),
      codecData: ' ',
      description: i.aboveArrow || '',
      destination_ip: dist.ip,
      destination_port: dist.port,
      details: i.details,
      dstAlias: DIST,
      id: 0,
      info_date: i.belowArrow || '... ',
      info_date_absolute: i.details || '... ',
      ipDirection: SRC + ' > ' + DIST,
      line: i.line,
      messageData: null,
      method: ' ',
      method_text: i.title || i.messageID,
      // micro_ts: 0,
      // milli_ts: 0,

      pid: 0,
      sourceLabel: i.sourceLabel,
      destinationLabel: i.destinationLabel,
      source_data: null,
      source_ip: src.ip,
      source_port: src.port,
      srcAlias: SRC,

      typeItem: 'SIP',
      hash: i.hash,
    };
  }
}
export const Flow = ({ formattingData = {}, theme = 'Light', filters = {}, isSimplify = false, onClickRow = (id: any) => {} }: any) => {
  console.log({ formattingData });
  const callFormattedData = useMemo(() => {
    return new FormatterData().formatter(formattingData) || {};
  }, [formattingData]);
  if (!callFormattedData.hosts) {
    return <></>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [callFilteredData, setCallFilteredData] = useState<any>(cloneObject(callFormattedData));
  // const [dialogs, setDialogs] = useState<DialogRow[]>([]);
  // const [maxZIndex, setMaxZIndex] = useState(100); // Track maximum z-index
  console.log('filters inside flow', filters);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // if (!filters?.PayloadType) {
    //   // setCallFilteredData({
    //   //   ...callFormattedData,
    //   //   shownHosts: callFormattedData.hosts,
    //   //   hostsIPs: callFormattedData.hosts,
    //   //   hostsCA: callFormattedData.hosts,
    //   // });
    //   // return;
    //   filters = {
    //     PayloadType
    //   }
    // }
    const {
      CallId = [],
      PayloadType = [],
      methodFilter = [],
      filterIP = [],
      // isSimplify = false,
      isSimplifyPort = false,
      isCombineByAlias = false,
      isCombineByAliasGroup = false,
    } = filters || {};

    const getHostsByMessage = (arrayItems: any[]) => {
      const filteredItems = arrayItems.filter((i) => i?.source_ip && i?.destination_ip);

      const collectH = filteredItems?.map((i) => {
        const source_ipisIPv6 = i?.source_ip?.match(/\:/g)?.length > 1 || false;
        const destination_ipisIPv6 = i?.destination_ip?.match(/\:/g)?.length > 1 || false;
        const sIP = source_ipisIPv6 ? `[${i.source_ip}]` : i.source_ip;
        const dIP = destination_ipisIPv6 ? `[${i.destination_ip}]` : i.destination_ip;
        const sIP_PORT = `${sIP}:${i.source_port}`;
        const dIP_PORT = `${dIP}:${i.destination_port}`;
        const { srcAlias, dstAlias } = i.source_data || {};
        return isCombineByAlias
          ? [(srcAlias === sIP ? sIP_PORT : srcAlias) || sIP_PORT, (dstAlias === sIP ? dIP_PORT : dstAlias) || dIP_PORT]
          : isSimplifyPort
          ? [i.source_ip, i.destination_ip]
          : [sIP_PORT, dIP_PORT];
      });
      // sort hosts by Items timeline1
      let sortHosts: any = [];
      for (let i = 0; i < collectH.length; i++) {
        const [src, dst] = collectH[i];
        // src
        if (!sortHosts.includes(src)) {
          sortHosts.push(src);
        }
        // dist
        if (!sortHosts.includes(dst)) {
          sortHosts.push(dst);
        }
      }

      let selected_hosts = sortHosts?.map((i: any) => {
        return callFormattedData.hosts.find((j: any) => {
          const outOf = j.host.replace(/[\[\]]+/g, '');
          return [j.ip, j.host, j.alias, outOf].includes(i);
        });
      });

      if (isCombineByAliasGroup) {
        selected_hosts = selected_hosts.filter((host: any) => {
          return true;
        });
      }
      return selected_hosts;
    };
    const filteredMessages = cloneObject(callFormattedData).messages.filter((item: any) => {
      const source_ip = filterIP?.find((i: any) => i.title === item.source_ip) || { selected: true };

      const destination_ip = filterIP?.find((i: any) => i.title === item.destination_ip) || { selected: true };

      const boolIP = source_ip.selected || destination_ip.selected;

      const callIdFilter = CallId?.find((i: any) => i.title === item.callid) || {
        selected: true,
      };
      const payloadFilter = PayloadType?.find((i: any) => i.title === item.typeItem) || { selected: true };

      let methods: any = { selected: true };

      methods = methodFilter?.find((i: any) => i.title === item.method) || {
        selected: true,
      };

      const bool = callIdFilter.selected && payloadFilter.selected && methods.selected && boolIP;

      // if (bool !== item.invisible) {
      //   item.invisibleDisplayNone = false;
      //   item.invisible = bool;
      // }
      return bool;
    });

    const hostsBuffer = getHostsByMessage(filteredMessages);
    const hostsIPs = hostsBuffer.filter((host: any) => !!host);

    const updateHosts = () => {
      hostsIPs.forEach((host: any) => {
        if (!host) {
          return;
        }
        if (!host.alias) {
          host.alias = host.ip;
        }
      });
      let aggregatedHosts = cloneObject(hostsIPs.filter((i: any) => !!i));
      aggregatedHosts.forEach((i: any) => {
        callFormattedData.hosts
          .filter((h: any) =>
            isCombineByAliasGroup ? h?.group === i?.group || h?.alias === i?.alias : h?.alias === i?.alias
          )
          ?.forEach((item: any) => {
            i.ip_array = i.ip_array || [];
            if (i.ip_array?.find(({ ip }: any) => ip === item.ip)) {
              return;
            }
            i?.ip_array?.push({
              ip: item.ip,
              host: item,
            });
          });
      });
      //
      aggregatedHosts.forEach((h: any, index: number) => {
        aggregatedHosts
          .filter(
            (host: any, i: number) =>
              i > index &&
              (isCombineByAliasGroup ? h.group === host.group : (h.alias || h.ip) === (host.alias || host.ip))
          )
          .forEach((item: any) => (item.invisible = true));
      });

      aggregatedHosts = aggregatedHosts.filter((h: any) => !h.invisible);
      return aggregatedHosts;
    };
    const hostsCA: any = updateHosts();
    const shownHosts: any = isCombineByAlias ? hostsCA : hostsIPs;
    const filteredHosts = callFormattedData.hosts.filter((host: any, k: number) => {
      return true; // k==0 || k==1;
    });

    const _filteredObject = {
      alias: callFormattedData.alias,
      callid: callFormattedData.callid,
      data: callFormattedData.data,
      filters: callFormattedData.filters,
      hostinfo: callFormattedData.hostinfo,
      hosts: filteredHosts,
      ipaliases: callFormattedData.ipaliases,
      messages: filteredMessages,
      uac: callFormattedData.uac,
      hostsIPs,
      hostsCA,
      shownHosts,
    };
    setCallFilteredData(cloneObject(_filteredObject));
  }, [formattingData, filters]);

  // Return early if no call data is available
  if (!callFilteredData || Object.keys(callFilteredData).length === 0) {
    return <></>;
  }
  console.log('callFilteredData', { callFilteredData });
  // Prepare host data
  const flowGridLines = Array.from({
    length: (callFilteredData.shownHosts || callFilteredData.hosts).length - 1,
  });
  const pageWidth = (callFilteredData.shownHosts || callFilteredData.hosts).length * 200;

  // Host position finder

  // Process array items with necessary calculations
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const arrayItems = useMemo(() => {
    const getHostPosition = (ip: string, port: number, alias?: string) => {
      if (filters?.isCombineByAlias && ip === alias) {
        alias = callFilteredData.hostsIPs.find((i: any) => i.ip === ip)?.alias || alias;
      }
      ip = ip?.replace(/\[|\]/g, '');
      const hosts = filters?.isCombineByAlias ? callFilteredData.hostsCA : callFilteredData.hostsIPs;
      let hostIndex = hosts?.findIndex((host: any) => host.host === `${ip}:${port}`);
      if (hostIndex < 0) {
        hostIndex = hosts?.findIndex((host: any) => {
          return filters.isCombineByAlias
            ? host.alias && alias
              ? host.alias === alias
              : host.ip === ip
            : filters.isSimplifyPort
            ? host.ip === ip
            : host.ip === ip && host.port * 1 === port * 1;
        });
      }
      if (hostIndex < 0) {
        hostIndex = hosts.findIndex((host: any) => host.ip === ip || host.ip_array.find((h: any) => h.ip === ip));
      }
      return hostIndex;
    };
    const messages = callFilteredData.messages;
    const shownHosts = callFilteredData.shownHosts || callFilteredData.hosts;

    return messages?.map((item: any) => {
      const { srcAlias, dstAlias } = item || item?.messageData?.item || {};

      const srcPosition = getHostPosition(item.source_ip, item.source_port, srcAlias || item.source_ip);

      const dstPosition = getHostPosition(item.destination_ip, item.destination_port, dstAlias || item.destination_ip);

      const isRadialArrow = srcPosition === dstPosition;
      const isLastHost = isRadialArrow && shownHosts.length > 1 && shownHosts.length - 1 === srcPosition;

      const a = srcPosition;
      const b = dstPosition;
      const mosColor = item.QOS ? 'blinkLamp ' + mosColorBlink(item.QOS.MOS) : '';

      const { min, max, abs } = Math;

      item.options = {
        flowGridLines,
        mosColor,
        color: getColorByString(item.callid, 60, 60),
        tabColor: getColorByString(item.callid, 60, 60),
        arrowColor: getColorByString(item.callid, 60, 60),
        color_method: getMethodColor(item.method_text + ''),
        start: min(a, b),
        middle: abs(a - b) || 1,
        direction: isLastHost || a > b,
        rightEnd: shownHosts.length - 1 - max(a, b),
        shortdata: '',
        isRadialArrow,
        isLastHost,
        arrowStyleSolid: item.typeItem === FlowItemType.SIP,
      };

      return item;
    });
  }, [callFilteredData, filters]);


  return (
    <>
      <div className="w-full flex flex-col flex-1 h-full">
        <div className="s_host w-full flex flex-col flex-1 h-full">
          <div className={'s_host flow-container h-full ' + theme}>
            <div className="flowscreen">
              <FlowPolygon arrayItemsVisible={flowGridLines} flowGridLines={flowGridLines} />
              <div className="VS-Container-horizontal">
                <div className="VS-Container">
                  <FlowHostsLine
                    hostsIPs={callFilteredData.hostsIPs || callFilteredData.hosts}
                    hostsCA={callFilteredData.hostsCA || callFilteredData.hosts}
                    isSimplify={!!filters?.isSimplify}
                    _isCombineByAlias={!!filters?.isCombineByAlias}
                  />
                  <div
                    className="content-flow"
                    style={{
                      paddingTop: 0,
                      paddingBottom: 60,
                      paddingLeft: 56,
                      paddingRight: 65,
                      minWidth: pageWidth + 100,
                    }}
                  >
                    {arrayItems?.map((item: any, idx: number) => (
                      <FlowItem
                        key={idx}
                        item={item}
                        isSimplify={!!filters?.isSimplify}
                        isGroupByAlias={!!filters?.isGroupByAlias}
                        idx={idx}
                        onClickItem={(id: any, e: any) => {
                          console.log('<FlowItem: onClickItem', { id, e, item });
                          onClickRow(item.hash);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};
