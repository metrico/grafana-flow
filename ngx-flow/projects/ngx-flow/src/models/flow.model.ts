export interface FlowData  {
    actors?: Array<Actor>;
    data: Array<FlowItem>;
}
export interface FlowItem {
    messageID: string;
    source: string;
    destination: string;

    title?: string;
    subTitle?: string;

    // hidden in Simplified mode
    aboveArrow?: string;
    belowArrow?: string;
    sourceLabel?: string;
    destinationLabel?: string;

    // styling for individual elements
    arrowStyling?: ArrowStyling;
    textColors?: TextColors;
}
export interface ArrowStyling {
    // first number defines length of the dash, second number defines length of the empty space between
    dash?: [number, number];
    arrowType?: 'filled' | 'hollow';
}
export interface TextColors {
    title?: string;
    subTitle?: string;

    // hidden in Simplified mode
    aboveArrow?: string;
    belowArrow?: string;
    leftLabel?: string;
    rightLabel?: string;
}
export interface Actor {
    // ID is used to determine actor used by source/destination
    id: string;
    // Displayed title is used if you need to format it differently.
    // I.E. you source/destination correspond to IP:PORT, but to reduce clutter you want to display Actorrs only with IP
    displayedTitle: string;
    customHtml?: HTMLElement;
}
