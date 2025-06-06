import React from 'react';
import "./Flow-item.css"; 

const FlowItem = ({
  item,
  idx,
  onClickItem = (id: any, event: any) => {},
  isGroupByAlias = false,
  isSimplify = false,
  isAbsolute = false,
}: any) => {
  const checkAuthEmoji = (text: string) => {
    return (text + "").replace("(AUTH)", "&#128273;");
  };
  const MOSColorGradient = (num: number, s?: number, l?: number): string => {
    const modifier =
      num > 430
        ? 1
        : num > 400
        ? 0.8
        : num > 300
        ? 0.75
        : num < 200
        ? 0.3
        : 0.7;
    const hue = (num * modifier) / (450 / 100);
    return `hsl(${hue}, ${s ? s + "%" : "85%"}, ${l ? l + "%" : "55%"})`;
  };
  const MOSColorGradientLocal = (hue: number) => {
    return MOSColorGradient(hue * 100, 80, 50);
  };
  return (
    <div
      className="item-flow-packet-container"
      style={
        false && isGroupByAlias && isSimplify ? { marginRight: "50px" } : {}
      }
    >
      <div className="flow-grid-lines">
        {item?.options?.flowGridLines?.map((line: any, index: number) => (
          <div className="line" key={index}></div>
        ))}
      </div>
      <div
        className="bg-color-polygon"
        style={{ backgroundColor: item.options.color, opacity: 0.4 }}
      ></div>
      <div
        className="bg-color-tab"
        style={{ backgroundColor: item.options.tabColor }}
      ></div>

      <div style={{ flex: item.options.start || 0.0000001 }}></div>
      <div
        className="item-flow-packet"
        onClick={(event) => onClickItem(idx, event)}
        style={{
          flex: item.options.middle || 0.0000001,
          textAlign: item.options.direction ? "right" : "left",
        }}
      >
        <div
          className="call_text"
          style={{ color: item.options.color_method || "initial" }}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: checkAuthEmoji(item.method_text),
            }}
          ></span>
          {item.QOS && item.QOS.MOS && (
            <span
              className="blinkLamp"
              style={{ backgroundColor: MOSColorGradientLocal(item.QOS.MOS) }}
            ></span>
          )}
          {item.QOS
            ? item.QOS.MOS
              ? `${item.QOS.MOS} [${item.QOS.qosTYPEless}]`
              : "UA Report"
            : ""}
        </div>

        <div
          className="call_text-mini"
          style={{ height: !isSimplify ? 15 : 0 }}
        >
          {item.description}
        </div>
        <div
          className={`port-label-${!item.options.direction ? "left" : "right"}`}
          title={(isGroupByAlias && item.source_ip) || ""}
        >
          {item.sourceLabel}
        </div>
        {!item.options.isRadialArrow && (
          <div
            className={`arrow${item.options.direction ? " left" : ""}${
              item.options.arrowStyleSolid ? " arrow-solid" : " arrow-dotted"
            }`}
            style={{ color: item.options.arrowColor }}
          ></div>
        )}
        {item.options.isRadialArrow && (
          <div
            className={`$ {
              item.options.isLastHost ? 'radial-arrow-end' : 'radial-arrow'
            }${
              item.options.arrowStyleSolid ? " arrow-solid" : " arrow-dotted"
            }`}
            style={{ color: item.options.arrowColor }}
          ></div>
        )}
        {!item.options.isLastHost && (
          <div
            className={
              item.options.direction ? "port-label-left" : "port-label-right"
            }
            style={
              item.options.isRadialArrow
                ? { left: "-47px", right: "initial" }
                : {}
            }
            title={(isGroupByAlias && item.destination_ip) || ""}
          >
            {item.destinationLabel}
          </div>
        )}
        {item.options.isLastHost && (
          <div className="port-label-right">{item.destinationLabel}</div>
        )}
        <div
          className="call-text-date"
          style={{ maxHeight: !isSimplify ? 50 : 0 }}
        >
          {item.info_date}
        </div>
        <div className="call-text-date">
          {isAbsolute ? item.diff_absolute : item.diff ? item.diff : "+0.00ms"}
        </div>
      </div>
      <div
        style={{
          flex:
            item.options.rightEnd -
              (item.options.isRadialArrow && !item.options.isLastHost
                ? 1
                : 0) || 0.0000001,
        }}
      ></div>
    </div>
  );
};

export default FlowItem;
