import React from 'react';
import "./Flow.css";

export const FlowHostsLine = ({
  hostsCA = [],
  hostsIPs = [],
  isExport = false,
  isSimplify = false,
  _isCombineByAlias = false,
}: any) => {
  const hosts = _isCombineByAlias ? hostsCA : hostsIPs;

  const showTooltip = (str: string) => {
    /** todo */
  };

  const hideTooltip = () => {
    /** todo */
  };

 

  return (
    <div className="hosts" style={{ top: isExport ? 40 : 0 }}>
      <div className="hosts-wrapper" style={{minWidth: hosts.length * 202}}>
        {hosts.map((itemhost: any, index: number) => {
          if (itemhost.hidden) {
            return (<></>);
          }

          return (
            <div
              key={index}
              className={`item-wrapper${isSimplify ? " big" : ""}`}
            >
              <div
                className="item"
                id={
                  itemhost.alias && itemhost.alias !== itemhost.ip
                    ? itemhost.alias
                    : ""
                }
                style={{
                  borderColor:
                    (itemhost.color && itemhost.color.border) ,
                }}
              >
                <div
                  className="aliasfield"
                  onMouseOver={() => showTooltip(itemhost)}
                  onMouseOut={hideTooltip}
                  style={{
                    color: itemhost.color?.font ,
                    background: itemhost.color?.background ,
                  }}
                >
                 

                  {_isCombineByAlias ? (
                    <>
                      <div>Group:</div>
                      <div className="alias-name">
                        {itemhost.group || "...other..."}
                      </div>
                    </>
                  ) : (
                    <div className="alias-name">
                      {itemhost.alias && itemhost.alias !== itemhost.ip
                        ? itemhost.alias
                        : ""}
                    </div>
                  )}
                </div>

              
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

