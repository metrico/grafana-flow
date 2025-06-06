import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFilter } from "@fortawesome/free-solid-svg-icons";
import "./Flow.css";

export const FlowPolygon = ({ arrayItemsVisible, flowGridLines}: any) => {
    
    const pageWidth = (flowGridLines.length || 1) * 200;
    return (
        <>
            {arrayItemsVisible?.length === 0 && (
                <div style={{ textAlign: "center", padding: "8rem", color: "#aaa" }}>
                    <h1>No Data</h1>
                    {/* <FontAwesomeIcon icon={faFilter} /> */}
                </div>
            )}

            <div 
                className="flow-grid-lines-polygon" 
                style={{ minWidth: `${pageWidth - 16 * 2}px` }}
            >
                {flowGridLines.map((title: any, index: number) => (
                    <div key={index} className="line"></div>
                ))}
            </div>
        </>
    );
};


