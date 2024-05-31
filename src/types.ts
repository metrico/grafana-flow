export interface FlowOptions {
    title: OptionValue;
    aboveArrow: OptionValue;
    belowArrow: OptionValue;
    details: OptionValue;
    sourceLabel: OptionValue;
    destinationLabel: OptionValue;
    source: OptionValue;
    destination: OptionValue;
    sortoption: "none" | "time_old" | "time_new";
    colorGenerator: OptionValue;
    showbody: boolean;
}

type OptionValue = string | string[];
