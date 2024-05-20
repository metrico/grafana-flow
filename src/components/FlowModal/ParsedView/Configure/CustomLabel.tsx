import React, { useState } from 'react';
import { MultiValueGenericProps } from 'react-select';

export const MultiValueLabel = (props: MultiValueGenericProps<any>) => {
    const [label, setLabel] = useState(props.data.label)
    if (props.data && props.data.label && typeof props.data.label === 'string') {
        setLabel(label.replace('Full `', '').replace('` object', ''))
    }
    return (
        <div {...props.innerProps}>{label}</div>
    );
};

